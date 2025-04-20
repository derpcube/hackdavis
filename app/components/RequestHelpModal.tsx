import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserGroupIcon, PhoneIcon, MapPinIcon, ClockIcon, DocumentTextIcon, FireIcon, ExclamationTriangleIcon, ArrowsRightLeftIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import AddressAutocomplete from './AddressAutocomplete';

interface Incident {
  _id: string;
  address: string;
  description: string;
  status: string;
  createdAt: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface RequestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestHelpModal({ isOpen, onClose }: RequestHelpModalProps) {
  const [step, setStep] = useState<'chooseType' | 'existingIncident' | 'newRequest'>('chooseType');
  const [activeIncidents, setActiveIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    emergencyType: 'fire',
    description: '',
    latitude: '',
    longitude: '',
    incidentId: ''
  });
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState<'address' | 'coordinates'>('address');

  // Fetch active incidents when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/incidents');
        if (!response.ok) {
          throw new Error('Failed to fetch incidents');
        }
        const data = await response.json();
        // Only show active incidents
        const active = data.data.filter((incident: Incident) => incident.status === 'active');
        setActiveIncidents(active);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [isOpen]);

  const resetState = () => {
    setStep('chooseType');
    setSelectedIncident(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      emergencyType: 'fire',
      description: '',
      latitude: '',
      longitude: '',
      incidentId: ''
    });
    setCoordinates(null);
    setError('');
    setInputMethod('address');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let locationData = {};
    
    if (step === 'newRequest') {
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

        locationCoordinates = [lng, lat]; // GeoJSON format is [longitude, latitude]
      }
      
      locationData = {
        address: inputMethod === 'address' ? formData.address : `Custom location (${formData.latitude}, ${formData.longitude})`,
        location: {
          type: 'Point',
          coordinates: locationCoordinates
        }
      };
    }

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        emergencyType: formData.emergencyType,
        description: formData.description,
        ...(step === 'existingIncident' ? { incidentId: selectedIncident } : locationData)
      };
      
      console.log('Sending emergency request:', payload);
      
      const response = await fetch('http://localhost:5001/api/emergency-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit emergency request');
      }

      onClose();
      resetState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const renderChooseTypeStep = () => (
    <>
      <Dialog.Title
        as="h3"
        className="text-xl font-medium leading-6 text-white flex items-center mb-6"
      >
        <div className="p-2 rounded-full bg-blue-500/20 mr-3">
          <UserGroupIcon className="h-6 w-6 text-blue-500" />
        </div>
        Request Emergency Help
      </Dialog.Title>
      
      <div className="space-y-4 mt-8">
        <div 
          className="p-4 bg-[#2A303C]/80 hover:bg-[#323847] rounded-lg cursor-pointer transition-all border border-gray-700/30 flex items-start gap-4"
          onClick={() => setStep('existingIncident')}
        >
          <div className="bg-red-500/20 p-2 rounded-lg">
            <FireIcon className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h4 className="text-white font-medium text-lg">Report for an existing incident</h4>
            <p className="text-gray-400 text-sm mt-1">If you need help with a fire incident that has already been reported</p>
          </div>
        </div>

        <div 
          className="p-4 bg-[#2A303C]/80 hover:bg-[#323847] rounded-lg cursor-pointer transition-all border border-gray-700/30 flex items-start gap-4"
          onClick={() => setStep('newRequest')}
        >
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h4 className="text-white font-medium text-lg">New emergency request</h4>
            <p className="text-gray-400 text-sm mt-1">Request help for a new emergency situation</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg border border-gray-700/50 text-gray-300 hover:bg-gray-800/50 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:ring-offset-1 focus:ring-offset-gray-900"
        >
          Cancel
        </button>
      </div>
    </>
  );

  const renderExistingIncidentStep = () => (
    <>
      <Dialog.Title
        as="h3"
        className="text-xl font-medium leading-6 text-white flex items-center mb-6"
      >
        <div className="p-2 rounded-full bg-blue-500/20 mr-3">
          <FireIcon className="h-6 w-6 text-blue-500" />
        </div>
        Connect to Existing Incident
      </Dialog.Title>
      
      <div className="mb-4">
        <button 
          onClick={() => setStep('chooseType')}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          ← Back to options
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4 space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Select an active incident:</label>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-16 bg-gray-700 rounded mb-2"></div>
              <div className="h-16 bg-gray-700/60 rounded"></div>
            </div>
          ) : activeIncidents.length === 0 ? (
            <div className="text-center text-gray-400 py-6 border border-dashed border-gray-700/30 rounded-lg bg-[#2A303C]/30">
              <p className="font-medium">No active incidents</p>
              <p className="text-sm mt-1">Please create a new emergency request</p>
              <button 
                type="button"
                onClick={() => setStep('newRequest')} 
                className="mt-3 text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Create new request
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {activeIncidents.map(incident => (
                <div 
                  key={incident._id}
                  className={`p-3 rounded-lg cursor-pointer transition-all transform border ${
                    selectedIncident === incident._id 
                      ? 'bg-[#3B4251] border-blue-500' 
                      : 'bg-[#2A303C]/80 hover:bg-[#323847] border-gray-700/30'
                  }`}
                  onClick={() => setSelectedIncident(incident._id)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium text-white">Incident #{incident._id.slice(-4)}</div>
                    <div className="text-xs text-gray-400">{formatDate(incident.createdAt)}</div>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{incident.address}</div>
                  <div className="text-xs text-gray-400 line-clamp-1 mt-1">{incident.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedIncident && (
          <>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm px-4 py-3 transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm pl-10 pr-3 py-3 transition-all"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-400" />
                Describe your situation
              </label>
              <textarea
                name="description"
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm px-4 py-3 transition-all placeholder:text-gray-500"
                placeholder="Describe your emergency situation and the help you need"
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
                onClick={() => setStep('chooseType')}
                className="px-4 py-2.5 rounded-lg border border-gray-700/50 text-gray-300 hover:bg-gray-800/50 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:ring-offset-1 focus:ring-offset-gray-900"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedIncident}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[100px]"
              >
                {isSubmitting ? 'Submitting...' : 'Request Help'}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );

  const renderNewRequestStep = () => (
    <>
      <Dialog.Title
        as="h3"
        className="text-xl font-medium leading-6 text-white flex items-center mb-6"
      >
        <div className="p-2 rounded-full bg-blue-500/20 mr-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-blue-500" />
        </div>
        New Emergency Request
      </Dialog.Title>
      
      <div className="mb-4">
        <button 
          onClick={() => setStep('chooseType')}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          ← Back to options
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4 space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm px-4 py-3 transition-all"
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <PhoneIcon className="h-5 w-5" />
            </div>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm pl-10 pr-3 py-3 transition-all"
              placeholder="(123) 456-7890"
            />
          </div>
        </div>
        
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
                  className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm px-4 py-3 transition-all"
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
                  className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm px-4 py-3 transition-all"
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
          <label htmlFor="emergencyType" className="block text-sm font-medium text-gray-300">
            Type of Emergency
          </label>
          <select
            name="emergencyType"
            id="emergencyType"
            value={formData.emergencyType}
            onChange={handleChange}
            className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm px-4 py-3 transition-all"
          >
            <option value="fire">Fire</option>
            <option value="medical">Medical</option>
            <option value="rescue">Rescue</option>
            <option value="other">Other</option>
          </select>
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
            className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500/30 sm:text-sm px-4 py-3 transition-all placeholder:text-gray-500"
            placeholder="Describe your emergency situation and the help you need"
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
            onClick={() => setStep('chooseType')}
            className="px-4 py-2.5 rounded-lg border border-gray-700/50 text-gray-300 hover:bg-gray-800/50 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:ring-offset-1 focus:ring-offset-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (inputMethod === 'address' && !coordinates)}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[100px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={() => {
          onClose();
          // Reset on close with a small delay to avoid visual glitches
          setTimeout(resetState, 300);
        }}
      >
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
                {step === 'chooseType' && renderChooseTypeStep()}
                {step === 'existingIncident' && renderExistingIncidentStep()}
                {step === 'newRequest' && renderNewRequestStep()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}