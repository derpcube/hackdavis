'use client';

import { useEffect, useState } from 'react';
import { Card, Title, Text } from '@tremor/react';
import IncidentDetailsModal from './IncidentDetailsModal';
import { FireIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Incident {
  _id: string;
  address: string;
  description: string;
  status: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
}

interface ActiveIncidentsProps {
  onViewOnMap?: (incidentId: string) => void;
}

export default function ActiveIncidents({ onViewOnMap }: ActiveIncidentsProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/incidents');
        if (!response.ok) {
          throw new Error('Failed to fetch incidents');
        }
        const data = await response.json();
        setIncidents(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleViewOnMap = (e: React.MouseEvent, incidentId: string) => {
    // Stop propagation to prevent opening the modal
    e.stopPropagation();
    if (onViewOnMap) {
      onViewOnMap(incidentId);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1A1F2B] border-gray-800">
        <Title className="text-gray-400 mb-4 text-sm font-medium">ACTIVE INCIDENTS</Title>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mt-2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1A1F2B] border-gray-800">
        <Title className="text-gray-400 mb-4 text-sm font-medium">ACTIVE INCIDENTS</Title>
        <div className="text-red-500 text-sm">{error}</div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-[#1A1F2B] border-gray-800">
        <Title className="text-gray-400 mb-4 text-sm font-medium flex items-center">
          <FireIcon className="h-4 w-4 mr-2 text-red-500" />
          ACTIVE INCIDENTS
        </Title>
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div 
              key={incident._id} 
              className="p-3 bg-[#2A303C] hover:bg-[#323847] rounded-lg cursor-pointer transition-all transform hover:scale-[1.01] border border-gray-700/20"
              onClick={() => handleIncidentClick(incident)}
            >
              <div className="flex justify-between items-center">
                <Text className="text-white font-medium">Incident #{incident._id.slice(-4)}</Text>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  incident.status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                } font-medium`}>
                  {incident.status}
                </span>
              </div>
              <Text className="text-gray-400 text-sm mt-1">{incident.address}</Text>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#2A303C] flex items-center justify-center text-xs text-white font-medium">FD</div>
                    <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-[#2A303C] flex items-center justify-center text-xs text-white font-medium">E1</div>
                    <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-[#2A303C] flex items-center justify-center text-xs text-white font-medium">P3</div>
                  </div>
                  <Text className="text-gray-400 text-xs">3 units responding</Text>
                </div>
                
                {onViewOnMap && (
                  <button
                    onClick={(e) => handleViewOnMap(e, incident._id)}
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 bg-blue-500/10 rounded"
                  >
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    View on map
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {incidents.length === 0 && (
            <div className="text-center text-gray-400 py-8 border border-dashed border-gray-700/30 rounded-lg bg-[#2A303C]/30">
              <p className="font-medium">No active incidents</p>
              <p className="text-sm mt-1">All clear for now</p>
            </div>
          )}
        </div>
      </Card>

      {selectedIncident && (
        <IncidentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          incident={selectedIncident}
          onViewOnMap={onViewOnMap ? () => onViewOnMap(selectedIncident._id) : undefined}
        />
      )}
    </>
  );
}