import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, FileText, Tag } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventFormData } from '../types';
import ImageUploader from '../components/ImageUploader';
import EventMap from '../components/EventMap';
import AddressAutocomplete from '../components/AddressAutocomplete';

const AddEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    locationName: '',
    locationAddress: '',
    category: 'other',
    image: '',
    organizer: ''
  });

  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (base64Image: string) => {
    setFormData(prev => ({ ...prev, image: base64Image }));
    
    // Clear error when image is updated
    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const handleMapClick = (coordinates: [number, number]) => {
    setSelectedCoordinates(coordinates);
    
    // Update form with a placeholder for the clicked location
    setFormData(prev => ({
      ...prev,
      locationName: prev.locationName || 'Selected Location',
      locationAddress: prev.locationAddress || 'Address will be determined from map'
    }));
  };

  const handleAddressSelect = (address: string, coordinates: [number, number]) => {
    // Update form data with the selected address
    setFormData(prev => ({
      ...prev,
      locationAddress: address,
      // If location name is empty or the default placeholder, update it with a simplified version of the address
      locationName: prev.locationName === '' || prev.locationName === 'Selected Location' 
        ? address.split(',')[0] 
        : prev.locationName
    }));
    
    // Update the selected coordinates
    setSelectedCoordinates(coordinates);
    
    // Clear any address-related errors
    if (errors.locationAddress || errors.location) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.locationAddress;
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.locationName.trim()) newErrors.locationName = 'Location name is required';
    if (!formData.locationAddress.trim()) newErrors.locationAddress = 'Address is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';
    
    // Image validation
    if (!formData.image) {
      newErrors.image = 'Event image is required';
    }
    
    // Location validation
    if (!selectedCoordinates && !formData.locationAddress) {
      newErrors.location = 'Please either select a location on the map or enter an address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await addEvent(formData, selectedCoordinates || undefined);
      navigate('/');
    } catch (error) {
      console.error('Error adding event:', error);
      setErrors({ submit: 'Failed to add event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Event</h1>
          <p className="text-indigo-100 mt-2">Share your event with the community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {errors.submit}
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-indigo-600" />
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your event"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
              Location
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.locationName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Venue name"
              />
              <AddressAutocomplete
                onAddressSelect={handleAddressSelect}
                initialValue={formData.locationAddress}
                error={errors.locationAddress}
              />
            </div>
            {errors.locationName && <p className="text-red-500 text-sm mt-1">{errors.locationName}</p>}
            
            <div className="mt-4 mb-2">
              <p className="text-gray-700 font-medium mb-2">Select Location on Map</p>
              <p className="text-gray-500 text-sm mb-2">
                Click on the map to set the event location or search by address above
              </p>
              <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                <EventMap 
                  events={selectedCoordinates ? [{
                    id: 'new-event',
                    title: formData.title || 'New Event',
                    description: formData.description || 'Event description',
                    date: formData.date || '2025-01-01',
                    time: formData.time || '12:00',
                    location: {
                      name: formData.locationName || 'Selected Location',
                      address: formData.locationAddress || 'Address',
                      coordinates: selectedCoordinates
                    },
                    category: formData.category,
                    image: formData.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    organizer: formData.organizer || 'Event Organizer'
                  }] : []}
                  height="100%"
                  onMapClick={handleMapClick}
                  interactive={true}
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="party">Party</option>
              <option value="club">Club</option>
              <option value="sports">Sports</option>
              <option value="concert">Concert</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <ImageUploader 
            onImageChange={handleImageChange}
            currentImage={formData.image}
            error={errors.image}
          />
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Organizer
            </label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.organizer ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Organizer name or organization"
            />
            {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Adding Event...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;