import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventFormData } from '../types';
import { events as initialEvents } from '../data/events';

interface EventContextType {
  events: Event[];
  addEvent: (eventData: EventFormData, coordinates?: [number, number]) => void;
  geocodeAddress: (address: string) => Promise<[number, number]>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Function to convert a File to a base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Geocoding function using Google Maps Geocoding API
const geocodeAddress = async (address: string): Promise<[number, number]> => {
  try {
    // Use the browser's Geocoding API if available
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve([location.lat(), location.lng()]);
          } else {
            reject(new Error('Geocoding failed: ' + status));
          }
        });
      });
    } else {
      // Fallback to mock geocoding if Google Maps is not loaded
      console.warn('Google Maps Geocoder not available, using mock geocoding');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock coordinates based on address
      if (address.toLowerCase().includes('new york')) {
        return [40.7128, -74.0060];
      } else if (address.toLowerCase().includes('los angeles')) {
        return [34.0522, -118.2437];
      } else if (address.toLowerCase().includes('chicago')) {
        return [41.8781, -87.6298];
      } else {
        // Default to a random location in NYC area
        return [
          40.7128 + (Math.random() - 0.5) * 0.1,
          -74.0060 + (Math.random() - 0.5) * 0.1
        ];
      }
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to geocode address');
  }
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get events from localStorage, or use initial data
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = async (eventData: EventFormData, coordinates?: [number, number]) => {
    let eventCoordinates: [number, number];
    
    if (coordinates) {
      // Use provided coordinates if available (from map click or address selection)
      eventCoordinates = coordinates;
    } else {
      // Otherwise geocode the address
      try {
        eventCoordinates = await geocodeAddress(eventData.locationAddress);
      } catch (error) {
        console.error('Error geocoding address:', error);
        // Fallback to NYC coordinates
        eventCoordinates = [40.7128, -74.0060];
      }
    }

    const newEvent: Event = {
      id: Date.now().toString(), // Simple ID generation
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: {
        name: eventData.locationName,
        address: eventData.locationAddress,
        coordinates: eventCoordinates
      },
      category: eventData.category,
      image: eventData.image,
      organizer: eventData.organizer
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent, geocodeAddress }}>
      {children}
    </EventContext.Provider>
  );
};