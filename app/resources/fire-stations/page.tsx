'use client';

import { useState } from 'react';
import { fetchFireStations, findNearbyFireStations } from '@/app/lib/fireStations';
import { FireStation } from '@/app/lib/types';
import Navigation from '@/app/components/Navigation';
import SystemStatus from '@/app/components/SystemStatus';
import QuickActions from '@/app/components/QuickActions';
import AddressSearch from '@/app/components/AddressSearch';
import StationList from '@/app/components/StationList';
import StationDetails from '@/app/components/StationDetails';

export default function FireStationsPage() {
  const [nearbyStations, setNearbyStations] = useState<FireStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<FireStation | null>(null);

  const handleSearch = async (lat: number, lon: number, radius: number) => {
    const stations = await fetchFireStations();
    const nearby = findNearbyFireStations(
      { lat, lng: lon },
      radius,
      stations
    );
    setNearbyStations(nearby);
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-gray-100">
      <Navigation />

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            <SystemStatus
              activeStations={nearbyStations.length}
              totalStations={156}
              monitoredRegions={1144}
            />
            <QuickActions />
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-[#1e2538] rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Fire Stations</h1>
                <AddressSearch onSearch={handleSearch} />
              </div>

              <StationList
                stations={nearbyStations}
                selectedStation={selectedStation}
                onSelectStation={setSelectedStation}
              />

              {selectedStation && <StationDetails station={selectedStation} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 