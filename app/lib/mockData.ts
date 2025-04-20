import { FireZone, Resource, WeatherData } from './types';

export const mockFireZones: FireZone[] = [
  {
    id: 'davis-1',
    name: 'Davis Fire Zone 1',
    coordinates: { lat: 38.5449, lng: -121.7405 },
  },
  {
    id: 'sacramento-1',
    name: 'Sacramento Fire Zone 1',
    coordinates: { lat: 38.5816, lng: -121.4944 },
  },
  {
    id: 'woodland-1',
    name: 'Woodland Fire Zone 1',
    coordinates: { lat: 38.6785, lng: -121.7732 },
  },
];

export const mockResources: Resource[] = [
  {
    id: 'truck-1',
    type: 'Truck',
    name: 'Engine 101',
    status: 'available',
    currentLocation: { lat: 38.5449, lng: -121.7405 },
    capabilities: ['water-pump', 'ladder', 'medical'],
  },
  {
    id: 'truck-2',
    type: 'Truck',
    name: 'Engine 102',
    status: 'available',
    currentLocation: { lat: 38.5816, lng: -121.4944 },
    capabilities: ['water-pump', 'hazmat'],
  },
  {
    id: 'crew-1',
    type: 'Crew',
    name: 'Strike Team Alpha',
    status: 'available',
    currentLocation: { lat: 38.6785, lng: -121.7732 },
    capabilities: ['ground-ops', 'medical', 'rescue'],
  },
  {
    id: 'helicopter-1',
    type: 'Helicopter',
    name: 'Air Support 1',
    status: 'available',
    currentLocation: { lat: 38.5449, lng: -121.7405 },
    capabilities: ['water-drop', 'rescue', 'surveillance'],
  },
  {
    id: 'equipment-1',
    type: 'Equipment',
    name: 'Mobile Command Unit',
    status: 'available',
    currentLocation: { lat: 38.5816, lng: -121.4944 },
    capabilities: ['command-center', 'communications'],
  },
];

export const calculateResourceNeedScore = (weatherData: WeatherData): number => {
  return (
    weatherData.MAX_TEMP / 100 +
    weatherData.AVG_WIND_SPEED * 0.5 -
    weatherData.LAGGED_PRECIPITATION * 2
  );
};

export const calculateEdgeWeight = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  windSpeed: number
): number => {
  // Simple distance calculation (Haversine formula)
  const R = 6371; // Earth's radius in km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLon = (to.lng - from.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Adjust distance by wind speed
  return distance + (windSpeed * 0.1);
};

export const mockWeatherData: WeatherData = {
  DATE: new Date().toISOString(),
  MAX_TEMP: 85,
  AVG_WIND_SPEED: 15,
  LAGGED_PRECIPITATION: 0.1,
  WIND_TEMP_RATIO: 0.18,
}; 