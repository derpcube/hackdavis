import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FireIcon, MapPinIcon, ClockIcon, DocumentTextIcon, GlobeAltIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import AddressAutocomplete from './AddressAutocomplete';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportIncidentModal({ isOpen, onClose }: ReportIncidentModalProps) {
  const [formData, setFormData] = useState({
    address: '',
    timestamp: '',
    description: '',
    latitude: '',
    longitude: ''
  });
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState<'address' | 'coordinates'>('address');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let locationCoordinates;
    if (inputMethod === 'address') {
      if (!coordinates) {
        setError('Please select a valid address from the suggestions');
        setIsSubmitting(false);
        return;
      }
      locationCoordinates = [coordinates.lng, coordinates.lat];
    } else {
      // Validate coordinate inputs
      if (!formData.latitude || !formData.longitude) {
        setError('Please enter both latitude and longitude values');
        setIsSubmitting(false);
        return;
      }

      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        setError('Please enter valid numeric coordinates');
        setIsSubmitting(false);
        return;
      }

      if (lat < -90 || lat > 90) {
        setError('Latitude must be between -90 and 90 degrees');
        setIsSubmitting(false);
        return;
      }

      if (lng < -180 || lng > 180) {
        setError('Longitude must be between -180 and 180 degrees');
        setIsSubmitting(false);
        return;
      }

      locationCoordinates = [lng, lat]; // GeoJSON format is [longitude, latitude]
    }

    try {
      console.log('Sending incident data:', {
        ...formData,
        location: {
          type: 'Point',
          coordinates: locationCoordinates
        }
      });
      
      const response = await fetch('http://localhost:5001/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: inputMethod === 'address' ? formData.address : `Custom location (${formData.latitude}, ${formData.longitude})`,
          timestamp: formData.timestamp,
          description: formData.description,
          location: {
            type: 'Point',
            coordinates: locationCoordinates
          }
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Server error:', responseData);
        throw new Error(responseData.error || 'Failed to report incident');
      }

      onClose();
      // Reset form
      setFormData({
        address: '',
        timestamp: '',
        description: '',
        latitude: '',
        longitude: ''
      });
      setCoordinates(null);
      setInputMethod('address');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (address: string) => {
    setFormData(prev => ({
      ...prev,
      address
    }));
    // If user is typing manually, we reset coordinates until they select from dropdown
    if (coordinates) setCoordinates(null);
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));
    setCoordinates({ lat, lng });
  };

  const toggleInputMethod = () => {
    setInputMethod(prev => prev === 'address' ? 'coordinates' : 'address');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-[#1A1F2B] to-[#202634] p-8 text-left align-middle shadow-xl transition-all border border-gray-800/50">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-white flex items-center mb-6"
                >
                  <div className="p-2 rounded-full bg-red-500/20 mr-3">
                    <FireIcon className="h-6 w-6 text-red-500" />
                  </div>
                  Report Fire Incident
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-300 flex items-center">
                        {inputMethod === 'address' ? (
                          <>
                            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                            Location (Address)
                          </>
                        ) : (
                          <>
                            <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                            Location (Coordinates)
                          </>
                        )}
                      </label>
                      <button 
                        type="button"
                        onClick={toggleInputMethod}
                        className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ArrowsRightLeftIcon className="h-3 w-3 mr-1" />
                        Switch to {inputMethod === 'address' ? 'coordinates' : 'address'}
                      </button>
                    </div>

                    {inputMethod === 'address' ? (
                      <div className="relative">
                        <AddressAutocomplete 
                          value={formData.address} 
                          onChange={handleAddressChange}
                          onSelect={handleAddressSelect}
                        />
                        {coordinates && (
                          <div className="absolute right-2 top-2">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Location verified
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="latitude" className="block text-sm text-gray-400 mb-1">Latitude</label>
                          <input
                            type="text"
                            name="latitude"
                            id="latitude"
                            placeholder="e.g., 38.5449"
                            value={formData.latitude}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500/30 sm:text-sm px-4 py-3 transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="longitude" className="block text-sm text-gray-400 mb-1">Longitude</label>
                          <input
                            type="text"
                            name="longitude"
                            id="longitude"
                            placeholder="e.g., -121.7405"
                            value={formData.longitude}
                            onChange={handleChange}
                            className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500/30 sm:text-sm px-4 py-3 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {inputMethod === 'address' && !coordinates && formData.address && (
                      <p className="text-amber-400 text-xs mt-1">
                        Please select an address from the dropdown for accurate mapping
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="timestamp" className="block text-sm font-medium text-gray-300 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      When did it occur?
                    </label>
                    <input
                      type="datetime-local"
                      name="timestamp"
                      id="timestamp"
                      required
                      value={formData.timestamp}
                      onChange={handleChange}
                      className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500/30 sm:text-sm px-4 py-3 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-400" />
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500/30 sm:text-sm px-4 py-3 transition-all placeholder:text-gray-500"
                      placeholder="Describe the situation and any important details"
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      {error}
                    </div>
                  )}

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-lg border border-gray-700/50 text-gray-300 hover:bg-gray-800/50 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:ring-offset-1 focus:ring-offset-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || (inputMethod === 'address' && !coordinates)}
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-600 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[100px]"
                    >
                      {isSubmitting ? 'Submitting...' : 'Report Incident'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}