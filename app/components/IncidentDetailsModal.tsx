import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FireIcon, ClockIcon, MapPinIcon, BoltIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

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

interface IncidentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  onViewOnMap?: () => void;
}

export default function IncidentDetailsModal({ isOpen, onClose, incident, onViewOnMap }: IncidentDetailsModalProps) {
  if (!incident) return null;

  // Format the date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
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
                <div className="flex justify-between items-center mb-5">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium text-white flex items-center"
                  >
                    <div className="p-2 rounded-full bg-red-500/20 mr-3">
                      <FireIcon className="h-6 w-6 text-red-500" />
                    </div>
                    Incident #{incident._id.slice(-4)}
                  </Dialog.Title>
                  <span className={`px-3 py-1.5 text-xs rounded-full ${
                    incident.status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  } font-medium flex items-center`}>
                    <BoltIcon className="h-3.5 w-3.5 mr-1" />
                    {incident.status}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="border-t border-gray-800/50 pt-4">
                    <div className="grid gap-4">
                      <div>
                        <p className="text-sm text-gray-400 flex items-center mb-1">
                          <MapPinIcon className="h-4 w-4 mr-1.5" /> Location
                        </p>
                        <p className="text-white text-base font-medium">{incident.address}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 flex items-center mb-1">
                          <ClockIcon className="h-4 w-4 mr-1.5" /> Reported At
                        </p>
                        <p className="text-white">{formatDate(incident.createdAt)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 mb-2">Description</p>
                        <div className="p-4 rounded-lg bg-[#2A303C]/60 border border-gray-700/30 text-white">
                          {incident.description}
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-400 mb-2">Response Status</p>
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#2A303C]/60 border border-gray-700/30">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#2A303C] flex items-center justify-center text-xs text-white font-medium">FD</div>
                            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-[#2A303C] flex items-center justify-center text-xs text-white font-medium">E1</div>
                            <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-[#2A303C] flex items-center justify-center text-xs text-white font-medium">P3</div>
                          </div>
                          <span className="text-gray-300 text-sm">3 units responding</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-400 mb-2">Coordinates</p>
                        <div className="text-gray-300 text-sm bg-[#2A303C]/60 p-4 rounded-lg border border-gray-700/30 font-mono">
                          {incident.location.coordinates[1].toFixed(6)}, {incident.location.coordinates[0].toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  {onViewOnMap && (
                    <button
                      type="button"
                      onClick={onViewOnMap}
                      className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1 focus:ring-offset-gray-900 flex items-center"
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      View on Map
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:ring-offset-1 focus:ring-offset-gray-900"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}