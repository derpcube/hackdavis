'use client';

import { useEffect, useState } from 'react';
import { Card, Title, Text } from '@tremor/react';

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

export default function ActiveIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <Card className="bg-[#1A1F2B] border-gray-800">
      <Title className="text-gray-400 mb-4 text-sm font-medium">ACTIVE INCIDENTS</Title>
      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident._id} className="p-3 bg-[#2A303C] hover:bg-[#323847] rounded-lg cursor-pointer transition-all">
            <div className="flex justify-between items-center">
              <Text className="text-white font-medium">Incident #{incident._id.slice(-4)}</Text>
              <span className={`px-2 py-1 text-xs rounded-full ${
                incident.status === 'active' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
              } font-medium`}>
                {incident.status}
              </span>
            </div>
            <Text className="text-gray-400 text-sm mt-1">{incident.address}</Text>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#2A303C]"></div>
                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-[#2A303C]"></div>
                <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-[#2A303C]"></div>
              </div>
              <Text className="text-gray-400 text-xs">3 units responding</Text>
            </div>
          </div>
        ))}
        {incidents.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No active incidents
          </div>
        )}
      </div>
    </Card>
  );
} 