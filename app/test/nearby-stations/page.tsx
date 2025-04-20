'use client';

import React, { useState, useEffect } from 'react';
import { fetchFireStations, findNearbyFireStations } from '../../lib/fireStations';
import { FireStation } from '../../lib/types';
import AddressAutocomplete from '../../components/AddressAutocomplete';

type StationWithDistance = FireStation & { distance: number };

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function NearbyStations() {
  const [fireAddress, setFireAddress] = useState('');
  const [fireLocation, setFireLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState('10');
  const [nearbyStations, setNearbyStations] = useState<StationWithDistance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allStations, setAllStations] = useState<FireStation[]>([]);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setIsLoading(true);
        const stations = await fetchFireStations();
        setAllStations(stations);
      } catch (err) {
        setError('Failed to load fire station data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStations();
  }, []);

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error('Could not geocode address');
    }
    
    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng
    };
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFireAddress(address);
    setFireLocation({ lat, lng });
  };

  const handleSearch = () => {
    if (!fireLocation) {
      setError('Please select a valid address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const radiusMiles = parseFloat(radius);
      const stations = findNearbyFireStations(fireLocation, radiusMiles, allStations);
      setNearbyStations(stations);
    } catch (err) {
      setError('An error occurred while finding nearby stations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Find Nearby Fire Stations</h1>
      
      <div className="mb-6 space-y-4">
        <div>
          <label className="block mb-2">
            Fire Location Address:
            <AddressAutocomplete
              value={fireAddress}
              onChange={setFireAddress}
              onSelect={handleAddressSelect}
            />
          </label>
        </div>
        
        <div>
          <label className="block mb-2">
            Search Radius (miles):
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="ml-2 p-2 border rounded"
              min="1"
            />
          </label>
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Searching...' : 'Find Nearby Stations'}
        </button>

        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </div>

      {nearbyStations.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Nearby Fire Stations</h2>
          {nearbyStations.map((station) => (
            <div key={station.id} className="p-4 border rounded">
              <h3 className="font-medium">{station.name}</h3>
              <p>Distance: {station.distance.toFixed(2)} miles</p>
              <p>Address: {station.address}, {station.city}, {station.county}</p>
              <p>Station Number: {station.stationNumber}</p>
              <p>Status: {station.status}</p>
            </div>
          ))}
        </div>
      ) : !error && !isLoading && (
        <p className="text-gray-500">Enter fire location address and click search to find nearby stations.</p>
      )}
    </div>
  );
} 