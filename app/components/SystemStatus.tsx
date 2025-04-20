interface SystemStatusProps {
  activeStations: number;
  totalStations: number;
  monitoredRegions: number;
}

export default function SystemStatus({ activeStations, totalStations, monitoredRegions }: SystemStatusProps) {
  return (
    <div className="bg-[#1e2538] rounded-lg p-4">
      <h2 className="text-gray-400 text-sm font-semibold mb-4">SYSTEM STATUS</h2>
      <div className="space-y-4">
        <div>
          <div className="text-gray-400 text-sm">ACTIVE STATIONS</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{activeStations}</span>
            <span className="ml-2 text-green-500">+2 last hour</span>
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">TOTAL STATIONS</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{totalStations}</span>
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">MONITORED REGIONS</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{monitoredRegions}</span>
            <span className="ml-2 text-blue-500">cameras active</span>
          </div>
        </div>
      </div>
    </div>
  );
} 