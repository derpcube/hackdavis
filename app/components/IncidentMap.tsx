'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { format } from 'date-fns';

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

interface Camera {
  id: string;
  lat: number;
  lon: number;
  url: string;
}

interface FireDepartment {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Davis, CA coordinates
const defaultCenter = {
  lat: 38.5449,
  lng: -121.7405
};

// Default Google Maps options
const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

export default function IncidentMap({
  focusedIncidentId = null,
  onMarkerClick = null
}: {
  focusedIncidentId?: string | null;
  onMarkerClick?: ((incident: Incident) => void) | null;
}) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [fireDepartments, setFireDepartments] = useState<FireDepartment[]>([]);
  const [showFireDepts, setShowFireDepts] = useState(false);
  const [selectedFireDept, setSelectedFireDept] = useState<FireDepartment | null>(null);
  const [showCameras, setShowCameras] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['places']
  });

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocation error:', err);
        }
      );
    }
  }, []);

  // Fetch incidents data
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        console.log("Fetching incidents for map...");
        const response = await fetch('http://localhost:5001/api/incidents');
        if (!response.ok) {
          throw new Error('Failed to fetch incidents');
        }
        const data = await response.json();
        console.log("Incidents data:", data.data);
        
        if (data.data && data.data.length > 0) {
          setIncidents(data.data);
          
          // Log first incident coordinates for debugging
          if (data.data[0]?.location?.coordinates) {
            console.log("First incident coordinates:", data.data[0].location.coordinates);
          }
        } else {
          console.log("No incidents found");
        }
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    
    // Poll for new incidents every 30 seconds
    const intervalId = setInterval(fetchIncidents, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch cameras data
  useEffect(() => {
    fetch('/cameras.txt')
      .then(res => res.json())
      .then(data => setCameras(data))
      .catch(err => console.error('Error loading cameras:', err));
  }, []);

  // Fetch fire departments data
  useEffect(() => {
    if (!isLoaded) return;
    
    console.log("Loading fire departments from JSON file...");
    
    fetch('/california_fire_departments_with_coordinates.json')
      .then(res => res.json())
      .then(data => {
        console.log(`Loaded ${data.length} fire departments`);
        setFireDepartments(data);
      })
      .catch(error => {
        console.error("Error loading fire departments:", error);
      });
  }, [isLoaded]);

  // Focus on a specific incident when focusedIncidentId changes
  useEffect(() => {
    if (focusedIncidentId && incidents.length > 0) {
      const incident = incidents.find(inc => inc._id === focusedIncidentId);
      
      if (incident) {
        setSelectedIncident(incident);
        
        // If we have a map instance, center it on the incident
        if (mapRef.current) {
          mapRef.current.panTo({
            lat: incident.location.coordinates[1],
            lng: incident.location.coordinates[0]
          });
          mapRef.current.setZoom(15);
        }
      }
    }
  }, [focusedIncidentId, incidents]);

  // Store map reference when map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle marker click
  const handleMarkerClick = (incident: Incident) => {
    setSelectedIncident(incident);
    
    // If onMarkerClick is provided, call it
    if (onMarkerClick) {
      onMarkerClick(incident);
    }
  };

  // Format date for display in info window
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (loadError) {
    return <div className="h-full w-full flex items-center justify-center text-red-500">Error loading Google Maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;
  }

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center">Loading incident data...</div>;
  }

  if (error) {
    return <div className="h-full w-full flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  // Default center (Davis, CA) if user location not available
  const center = userLocation || defaultCenter;

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={options}
        onLoad={onMapLoad}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google?.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#ef4444", // Tailwind red-500
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            }}
            title="You are here"
          />
        )}

        {/* Camera blue markers */}
        {showCameras && cameras.map((camera) => (
          <Marker
            key={camera.id}
            position={{ lat: camera.lat, lng: camera.lon }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
            title={camera.id}
            onClick={() => window.open(camera.url, '_blank')}
          />
        ))}

        {incidents.length > 0 && incidents.map((incident) => {
          // Make sure coordinates are in the correct order [longitude, latitude]
          // But Google Maps expects {lat, lng} format
          const position = {
            lat: incident.location.coordinates[1], // Latitude is second in GeoJSON
            lng: incident.location.coordinates[0]  // Longitude is first in GeoJSON
          };

          return (
            <div key={incident._id}>
              <Marker
                position={position}
                onClick={() => handleMarkerClick(incident)}
                icon={{
                  url: incident.status === 'active' 
                    ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  scaledSize: new google.maps.Size(40, 40)
                }}
                animation={
                  incident._id === focusedIncidentId 
                    ? google.maps.Animation.BOUNCE 
                    : incident.status === 'active' 
                      ? google.maps.Animation.DROP 
                      : undefined
                }
              />
              
              {/* Circle for active incidents */}
              {incident.status === 'active' && (
                <Circle
                  center={position}
                  radius={500}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: '#FF0000',
                    fillOpacity: 0.15,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Fire Department markers */}
        {showFireDepts && fireDepartments.map((dept, index) => (
          <Marker
            key={`fire-dept-${index}`}
            position={{ lat: dept.latitude, lng: dept.longitude }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
            title={dept.name}
            onClick={() => setSelectedFireDept(dept)}
          />
        ))}

        {/* Info Window for the selected incident */}
        {selectedIncident && (
          <InfoWindow
            position={{
              lat: selectedIncident.location.coordinates[1],
              lng: selectedIncident.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedIncident(null)}
          >
            <div className="bg-white p-3 min-w-[200px] max-w-[300px] rounded shadow-sm">
              <div className={`mb-2 p-1 text-center font-semibold ${
                selectedIncident.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              } rounded text-sm`}>
                {selectedIncident.status === 'active' ? 'ACTIVE INCIDENT' : 'RESOLVED'}
              </div>
              <p className="font-semibold text-gray-800">{selectedIncident.address}</p>
              <p className="text-gray-600 mt-1 mb-2 text-sm">{selectedIncident.description}</p>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <p className="text-xs text-gray-500">
                  Reported: {formatDate(selectedIncident.createdAt)}
                </p>
                <p className="text-xs text-gray-500">
                  ID: #{selectedIncident._id.slice(-4)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Coordinates: {selectedIncident.location.coordinates[1].toFixed(6)}, {selectedIncident.location.coordinates[0].toFixed(6)}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Fire Department Info Window */}
        {selectedFireDept && (
          <InfoWindow
            position={{ 
              lat: selectedFireDept.latitude, 
              lng: selectedFireDept.longitude 
            }}
            onCloseClick={() => setSelectedFireDept(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-gray-900">{selectedFireDept.name}</h3>
              <p className="text-sm text-gray-700">{selectedFireDept.address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Toggle buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Fire departments toggle */}
        <button
          onClick={() => setShowFireDepts(!showFireDepts)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          {fireDepartments.length === 0 
            ? 'Loading Fire Stations...' 
            : showFireDepts 
              ? `Hide Fire Stations (${fireDepartments.length})` 
              : `Show Fire Stations (${fireDepartments.length})`}
        </button>
        
        {/* Cameras toggle */}
        <button
          onClick={() => setShowCameras(!showCameras)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          {cameras.length === 0 
            ? 'Loading Cameras...' 
            : showCameras 
              ? `Hide Cameras (${cameras.length})` 
              : `Show Cameras (${cameras.length})`}
        </button>
      </div>
      
      {/* Debug info */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
        {incidents.length} incidents loaded
      </div>
    </div>
  );
}