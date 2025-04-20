import { NextResponse } from 'next/server';

export async function GET() {
  const fireZones = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'davis-1',
          name: 'Davis Fire Zone 1',
          priority: 'high'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-121.7505, 38.5549],
            [-121.7305, 38.5549],
            [-121.7305, 38.5349],
            [-121.7505, 38.5349],
            [-121.7505, 38.5549]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          id: 'sacramento-1',
          name: 'Sacramento Fire Zone 1',
          priority: 'medium'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-121.5044, 38.5916],
            [-121.4844, 38.5916],
            [-121.4844, 38.5716],
            [-121.5044, 38.5716],
            [-121.5044, 38.5916]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          id: 'woodland-1',
          name: 'Woodland Fire Zone 1',
          priority: 'low'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-121.7832, 38.6885],
            [-121.7632, 38.6885],
            [-121.7632, 38.6685],
            [-121.7832, 38.6685],
            [-121.7832, 38.6885]
          ]]
        }
      }
    ]
  };

  return NextResponse.json(fireZones);
} 