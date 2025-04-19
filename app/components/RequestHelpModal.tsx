import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserGroupIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface RequestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestHelpModal({ isOpen, onClose }: RequestHelpModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    emergencyType: 'fire',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/emergency-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit emergency request');
      }

      onClose();
      // Reset form
      setFormData({
        name: '',
        phone: '',
        address: '',
        emergencyType: 'fire',
        description: ''
      });
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
                  <UserGroupIcon className="h-6 w-6 text-blue-500 mr-2" />
                  Request Emergency Assistance
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
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
                      className="mt-1 block w-full rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                      Location
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full pl-10 rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="emergencyType" className="block text-sm font-medium text-gray-300">
                      Type of Emergency
                    </label>
                    <select
                      name="emergencyType"
                      id="emergencyType"
                      value={formData.emergencyType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="fire">Fire</option>
                      <option value="medical">Medical</option>
                      <option value="rescue">Rescue</option>
                      <option value="other">Other</option>
                    </select>
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
                      className="mt-1 block w-full rounded-md bg-[#2A303C] border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Describe the emergency situation"
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-700 bg-[#2A303C] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#323847] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Help'}
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