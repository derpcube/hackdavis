'use client';

import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';

interface SystemStatusProps {
  activeStations: number;
  totalStations: number;
  monitoredRegions: number;
}

export default function SystemStatus({ activeStations, totalStations, monitoredRegions }: SystemStatusProps) {
  const [activeFires, setActiveFires] = useState<number>(0);
  const [newFires, setNewFires] = useState<number>(0);
  const [fireTrend, setFireTrend] = useState<string>('stable');
  const [trendPercentage, setTrendPercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch incidents to get active fires count and calculate trends
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/incidents');
        
        if (response.ok) {
          const data = await response.json();
          const incidents = data.data || [];
          
          // Count active incidents
          const activeCount = incidents.filter((incident: any) => 
            incident.status === 'active'
          ).length;
          
          setActiveFires(activeCount);
          
          // Calculate new fires in last hour
          const oneHourAgo = new Date();
          oneHourAgo.setHours(oneHourAgo.getHours() - 1);
          
          const newFiresCount = incidents.filter((incident: any) => {
            const incidentDate = new Date(incident.createdAt);
            return incident.status === 'active' && incidentDate >= oneHourAgo;
          }).length;
          
          setNewFires(newFiresCount);

          // Calculate fire trend (comparing last 24h with previous 24h)
          const now = new Date();
          const yesterday = subDays(now, 1);
          const twoDaysAgo = subDays(now, 2);
          
          const last24Hours = incidents.filter((incident: any) => {
            const incidentDate = new Date(incident.createdAt);
            return incidentDate >= yesterday && incidentDate <= now;
          }).length;
          
          const previous24Hours = incidents.filter((incident: any) => {
            const incidentDate = new Date(incident.createdAt);
            return incidentDate >= twoDaysAgo && incidentDate < yesterday;
          }).length;
          
          // Calculate percentage change
          let percentChange = 0;
          if (previous24Hours > 0) {
            percentChange = Math.round(((last24Hours - previous24Hours) / previous24Hours) * 100);
          } else if (last24Hours > 0) {
            percentChange = 100; // If there were no incidents before but there are now
          }
          
          setTrendPercentage(percentChange);
          
          if (percentChange > 10) {
            setFireTrend('increasing');
          } else if (percentChange < -10) {
            setFireTrend('decreasing');
          } else {
            setFireTrend('stable');
          }
        }
      } catch (error) {
        console.error('Error fetching incidents for system status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    
    // Set up polling every 30 seconds to update the counts
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1e2538] rounded-lg p-4">
      <h2 className="text-gray-400 text-sm font-semibold mb-4">SYSTEM STATUS</h2>
      <div className="space-y-4">
        <div>
          <div className="text-gray-400 text-sm">ACTIVE FIRES</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{loading ? '...' : activeFires}</span>
            {newFires > 0 && (
              <span className="ml-2 text-red-500">+{newFires} last hour</span>
            )}
          </div>
          <div className="mt-1">
            <span className={`text-xs ${
              fireTrend === 'increasing' ? 'text-red-500' : 
              fireTrend === 'decreasing' ? 'text-green-500' : 
              'text-gray-400'
            }`}>
              {fireTrend === 'increasing' ? '↑' : 
               fireTrend === 'decreasing' ? '↓' : '→'} 
              {trendPercentage !== 0 && `${trendPercentage > 0 ? '+' : ''}${trendPercentage}%`} 
              24h trend
            </span>
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-sm">ACTIVE STATIONS</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{activeStations}</span>
            <span className="ml-2 text-green-500">+2 last hour</span>
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">DEPLOYED UNITS</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{totalStations}</span>
            <span className="ml-2 text-green-500">92% available</span>
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