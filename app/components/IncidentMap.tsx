'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

// Dynamically import the MapContainer component with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

// Dynamically import other Leaflet components
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Incident {
  _id: string;
  address: string;
  description: string;
  status: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export default function IncidentMap() {
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
  }, []);

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;
  }

  if (error) {
    return <div className="h-full w-full flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[38.5449, -121.7405]} // Davis, CA coordinates
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {incidents.map((incident) => (
          <Marker
            key={incident._id}
            position={incident.location.coordinates as LatLngExpression}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{incident.address}</p>
                <p className="text-gray-600">{incident.description}</p>
                <p className={`text-sm ${
                  incident.status === 'active' ? 'text-red-500' : 'text-green-500'
                }`}>
                  Status: {incident.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 