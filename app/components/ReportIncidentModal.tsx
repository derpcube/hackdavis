import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FireIcon } from '@heroicons/react/24/outline';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportIncidentModal({ isOpen, onClose }: ReportIncidentModalProps) {
  const [formData, setFormData] = useState({
    address: '',
    timestamp: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Format the address to be more geocoding-friendly
    const formattedData = {
      ...formData,
      address: formData.address
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .trim()                // Remove leading/trailing spaces
    };

    try {
      console.log('Sending incident data:', formattedData);
      const response = await fetch('http://localhost:5001/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
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
        description: ''
      });
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1A1F2B] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white flex items-center"
                >
                  <FireIcon className="h-6 w-6 text-red-500 mr-2" />
                  Report Fire Incident
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="Enter the location of the fire"
                    />
                  </div>

                  <div>
                    <label htmlFor="timestamp" className="block text-sm font-medium text-gray-300">
                      When did it occur?
                    </label>
                    <input
                      type="datetime-local"
                      name="timestamp"
                      id="timestamp"
                      required
                      value={formData.timestamp}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="Describe the situation and any important details"
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-700 bg-[#2A303C] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#323847] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Reporting...' : 'Report Incident'}
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