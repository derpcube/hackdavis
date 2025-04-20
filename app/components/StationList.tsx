import { FireStation } from '@/app/lib/types';

interface StationListProps {
  stations: FireStation[];
  selectedStation: FireStation | null;
  onSelectStation: (station: FireStation) => void;
}

export default function StationList({ stations, selectedStation, onSelectStation }: StationListProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stations.map((station) => (
        <div
          key={station.id}
          onClick={() => onSelectStation(station)}
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedStation?.id === station.id
              ? 'bg-[#2a3142] border border-blue-700'
              : 'bg-[#2a3142] hover:bg-[#2f3749]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{station.name}</h3>
            <span className="text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded">
              Active
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-2">{station.address}</div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Station {station.stationNumber}</span>
            {station.distance && (
              <span className="text-blue-400">{station.distance.toFixed(1)} mi</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 