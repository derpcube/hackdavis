import { FireStation } from './types';
import { calculateDistance, kmToMiles } from './utils';

// National Fire Department Registry API
const NFDR_API = 'https://apps.usfa.fema.gov/registry/api/public/fireDepartments';

// Mock data for development/testing
export const mockFireStations: FireStation[] = [
  // Northern California
  {
    id: 'SAC-1',
    name: 'Sacramento Fire Station 1',
    address: '123 Main St',
    city: 'Sacramento',
    county: 'Sacramento',
    coordinates: {
      lat: 38.5816,
      lng: -121.4944
    },
    stationNumber: 'SAC-1',
    status: 'active',
    resources: []
  },
  {
    id: 'SAC-2',
    name: 'Sacramento Fire Station 2',
    address: '456 Broadway',
    city: 'Sacramento',
    county: 'Sacramento',
    coordinates: {
      lat: 38.5716,
      lng: -121.4844
    },
    stationNumber: 'SAC-2',
    status: 'active',
    resources: []
  },
  {
    id: 'DAV-1',
    name: 'Davis Fire Station 1',
    address: '789 University Ave',
    city: 'Davis',
    county: 'Yolo',
    coordinates: {
      lat: 38.5449,
      lng: -121.7405
    },
    stationNumber: 'DAV-1',
    status: 'active',
    resources: []
  },
  {
    id: 'SF-1',
    name: 'San Francisco Fire Station 1',
    address: '123 Market St',
    city: 'San Francisco',
    county: 'San Francisco',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    },
    stationNumber: 'SF-1',
    status: 'active',
    resources: []
  },
  {
    id: 'OAK-1',
    name: 'Oakland Fire Station 1',
    address: '456 Broadway',
    city: 'Oakland',
    county: 'Alameda',
    coordinates: {
      lat: 37.8044,
      lng: -122.2711
    },
    stationNumber: 'OAK-1',
    status: 'active',
    resources: []
  },
  {
    id: 'SJ-1',
    name: 'San Jose Fire Station 1',
    address: '789 Santa Clara St',
    city: 'San Jose',
    county: 'Santa Clara',
    coordinates: {
      lat: 37.3382,
      lng: -121.8863
    },
    stationNumber: 'SJ-1',
    status: 'active',
    resources: []
  },

  // Central California
  {
    id: 'FRES-1',
    name: 'Fresno Fire Station 1',
    address: '123 Fulton St',
    city: 'Fresno',
    county: 'Fresno',
    coordinates: {
      lat: 36.7378,
      lng: -119.7871
    },
    stationNumber: 'FRES-1',
    status: 'active',
    resources: []
  },
  {
    id: 'MOD-1',
    name: 'Modesto Fire Station 1',
    address: '456 10th St',
    city: 'Modesto',
    county: 'Stanislaus',
    coordinates: {
      lat: 37.6391,
      lng: -120.9969
    },
    stationNumber: 'MOD-1',
    status: 'active',
    resources: []
  },

  // Southern California
  {
    id: 'LA-1',
    name: 'Los Angeles Fire Station 1',
    address: '123 Main St',
    city: 'Los Angeles',
    county: 'Los Angeles',
    coordinates: {
      lat: 34.0522,
      lng: -118.2437
    },
    stationNumber: 'LA-1',
    status: 'active',
    resources: []
  },
  {
    id: 'SD-1',
    name: 'San Diego Fire Station 1',
    address: '456 Broadway',
    city: 'San Diego',
    county: 'San Diego',
    coordinates: {
      lat: 32.7157,
      lng: -117.1611
    },
    stationNumber: 'SD-1',
    status: 'active',
    resources: []
  },
  {
    id: 'ANA-1',
    name: 'Anaheim Fire Station 1',
    address: '789 Center St',
    city: 'Anaheim',
    county: 'Orange',
    coordinates: {
      lat: 33.8366,
      lng: -117.9143
    },
    stationNumber: 'ANA-1',
    status: 'active',
    resources: []
  },
  {
    id: 'RIV-1',
    name: 'Riverside Fire Station 1',
    address: '123 Main St',
    city: 'Riverside',
    county: 'Riverside',
    coordinates: {
      lat: 33.9806,
      lng: -117.3755
    },
    stationNumber: 'RIV-1',
    status: 'active',
    resources: []
  },

  // Mountain Regions
  {
    id: 'TAC-1',
    name: 'Tahoe City Fire Station 1',
    address: '123 North Lake Blvd',
    city: 'Tahoe City',
    county: 'Placer',
    coordinates: {
      lat: 39.1724,
      lng: -120.1443
    },
    stationNumber: 'TAC-1',
    status: 'active',
    resources: []
  },
  {
    id: 'MAM-1',
    name: 'Mammoth Lakes Fire Station 1',
    address: '456 Main St',
    city: 'Mammoth Lakes',
    county: 'Mono',
    coordinates: {
      lat: 37.6485,
      lng: -118.9721
    },
    stationNumber: 'MAM-1',
    status: 'active',
    resources: []
  }
];

export async function fetchFireStations(): Promise<FireStation[]> {
  // For now, return mock data
  return mockFireStations;
}

export function findNearbyFireStations(
  fireLocation: { lat: number; lng: number },
  radiusMiles: number,
  stations: FireStation[]
): FireStation[] {
  return stations
    .map(station => ({
      ...station,
      distance: kmToMiles(calculateDistance(
        fireLocation.lat,
        fireLocation.lng,
        station.coordinates.lat,
        station.coordinates.lng
      ))
    }))
    .filter(station => station.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
} 