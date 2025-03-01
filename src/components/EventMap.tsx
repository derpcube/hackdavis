import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Event } from '../types';
import { format } from 'date-fns';

interface EventMapProps {
  events: Event[];
  height?: string;
  onMapClick?: (coordinates: [number, number]) => void;
  interactive?: boolean;
}

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

// Default center (New York City)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
    }
  ]
};

// Helper function to get marker icon based on category
const getCategoryIcon = (category: string) => {
  const baseSize = 36;
  
  // Define colors for each category
  const colors = {
    party: '#f87171', // red
    club: '#a78bfa', // purple
    sports: '#4ade80', // green
    concert: '#60a5fa', // blue
    other: '#9ca3af', // gray
    temp: '#3b82f6' // indigo for temporary markers
  };
  
  const color = colors[category as keyof typeof colors] || colors.other;
  
  return {
    path: 'M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z',
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: 'white',
    scale: 1.5,
    anchor: { x: 12, y: 22 },
    labelOrigin: { x: 12, y: 9 }
  };
};

const EventMap: React.FC<EventMapProps> = ({ 
  events, 
  height = '600px', 
  onMapClick,
  interactive = false
}) => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [tempMarker, setTempMarker] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAGz6n8_pNgKEWxptrnWBozrzFnOA7J0D4',
    libraries: ['places']
  });

  // Store map instance when the map is loaded
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle map click for interactive mode
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (interactive && onMapClick && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setTempMarker({ lat, lng });
      onMapClick([lat, lng]);
    }
  }, [interactive, onMapClick]);

  // Calculate map center based on events
  const getMapCenter = () => {
    if (events.length === 0) return defaultCenter;
    
    // Use the first event's location as center
    const firstEvent = events[0];
    return {
      lat: firstEvent.location.coordinates[0],
      lng: firstEvent.location.coordinates[1]
    };
  };

  // Render loading state
  if (loadError) {
    return (
      <div 
        style={{ height, width: '100%' }}
        className="rounded-lg shadow-md bg-gray-100 flex items-center justify-center"
      >
        <div className="text-center p-4">
          <p className="text-red-500 font-medium">Error loading maps</p>
          <p className="text-gray-600 mt-2">Please check your internet connection and try again</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        style={{ height, width: '100%' }}
        className="rounded-lg shadow-md bg-gray-100 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ height, width: '100%' }}
      className="rounded-lg shadow-md overflow-hidden"
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={getMapCenter()}
        zoom={12}
        options={mapOptions}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {/* Render event markers */}
        {events.map(event => (
          <Marker
            key={event.id}
            position={{
              lat: event.location.coordinates[0],
              lng: event.location.coordinates[1]
            }}
            icon={getCategoryIcon(event.category)}
            onClick={() => setSelectedEvent(event)}
          />
        ))}

        {/* Render temporary marker for new event location */}
        {tempMarker && (
          <Marker
            position={tempMarker}
            icon={getCategoryIcon('temp')}
          />
        )}

        {/* Info window for selected event */}
        {selectedEvent && (
          <InfoWindow
            position={{
              lat: selectedEvent.location.coordinates[0],
              lng: selectedEvent.location.coordinates[1]
            }}
            onCloseClick={() => setSelectedEvent(null)}
          >
            <div className="p-1">
              <h3 className="font-bold text-gray-800 mb-1">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                {format(new Date(selectedEvent.date), 'MMM dd, yyyy')} • {selectedEvent.time}
              </p>
              <p className="text-sm text-gray-600 mb-2">{selectedEvent.location.name}</p>
              <button
                onClick={() => navigate(`/event/${selectedEvent.id}`)}
                className="text-sm bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md text-xs">
          <div className="font-bold mb-1">Map Legend</div>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-400 mr-1"></div>
              <span>Party</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-400 mr-1"></div>
              <span>Club</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
              <span>Sports</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
              <span>Concert</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
              <span>Other</span>
            </div>
          </div>
        </div>
      </GoogleMap>
    </div>
  );
};

export default EventMap;