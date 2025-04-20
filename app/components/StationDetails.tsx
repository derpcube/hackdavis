import { FireStation } from '@/app/lib/types';

interface StationDetailsProps {
  station: FireStation;
}

export default function StationDetails({ station }: StationDetailsProps) {
  return (
    <div className="mt-6 bg-[#2a3142] rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Station Details</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#1e2538] rounded-lg">
          <h3 className="text-sm text-gray-400 mb-2">Location</h3>
          <p>{station.address}</p>
          <p>{station.city}, {station.county} County</p>
          <p className="text-sm text-gray-400 mt-2">
            Coordinates: {station.coordinates.lat}, {station.coordinates.lng}
          </p>
        </div>
        <div className="p-4 bg-[#1e2538] rounded-lg">
          <h3 className="text-sm text-gray-400 mb-2">Status</h3>
          <p>Station Number: {station.stationNumber}</p>
          <p>Status: <span className="text-green-400">Active</span></p>
          <p>Resources: {station.resources.length} units</p>
        </div>
        {station.distance && (
          <div className="p-4 bg-[#1e2538] rounded-lg">
            <h3 className="text-sm text-gray-400 mb-2">Response Time</h3>
            <p>{station.distance.toFixed(1)} miles from location</p>
            <p className="text-green-400">Est. 8-12 minutes</p>
          </div>
        )}
      </div>
    </div>
  );
} 