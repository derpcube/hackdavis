'use client';

import React, { useState } from 'react';
import { buildResourceAllocationGraph, findOptimalAssignments } from '../../lib/graphOptimization';
import { mockFireZones, mockResources, mockWeatherData } from '../../lib/mockData';
import { calculateResourceNeedScore } from '../../lib/mockData';

export default function GraphOptimizationTest() {
  const [assignments, setAssignments] = useState<{ [key: string]: string[] }>({});
  const [windSpeed, setWindSpeed] = useState(10);

  const runOptimization = () => {
    // Calculate priority scores based on weather data
    const priorityScores = mockFireZones.reduce((acc, zone) => {
      if (zone.currentWeather) {
        acc[zone.id] = calculateResourceNeedScore(zone.currentWeather);
      }
      return acc;
    }, {} as { [key: string]: number });

    // Build the graph
    const graph = buildResourceAllocationGraph(
      mockFireZones,
      mockResources,
      windSpeed
    );

    // Find optimal assignments
    const newAssignments = findOptimalAssignments(graph, priorityScores);
    setAssignments(newAssignments);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Graph Optimization Test</h1>
      
      <div className="mb-6">
        <label className="block mb-2">
          Wind Speed:
          <input
            type="number"
            value={windSpeed}
            onChange={(e) => setWindSpeed(Number(e.target.value))}
            className="ml-2 p-2 border rounded"
          />
        </label>
        <button
          onClick={runOptimization}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Optimization
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Fire Zones</h2>
          <div className="space-y-4">
            {mockFireZones.map((zone) => (
              <div key={zone.id} className="p-4 border rounded">
                <h3 className="font-medium">{zone.name}</h3>
                <p>ID: {zone.id}</p>
                <p>Coordinates: {zone.coordinates.lat}, {zone.coordinates.lng}</p>
                {zone.currentWeather && (
                  <div className="mt-2">
                    <p>Temperature: {zone.currentWeather.MAX_TEMP}°F</p>
                    <p>Wind Speed: {zone.currentWeather.AVG_WIND_SPEED} mph</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Resource Assignments</h2>
          <div className="space-y-4">
            {Object.entries(assignments).map(([zoneId, resourceIds]) => (
              <div key={zoneId} className="p-4 border rounded">
                <h3 className="font-medium">
                  {mockFireZones.find(z => z.id === zoneId)?.name}
                </h3>
                <div className="mt-2">
                  <p className="font-medium">Assigned Resources:</p>
                  {resourceIds.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {resourceIds.map(resourceId => {
                        const resource = mockResources.find(r => r.id === resourceId);
                        return (
                          <li key={resourceId}>
                            {resource?.name} ({resource?.type})
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No resources assigned</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 