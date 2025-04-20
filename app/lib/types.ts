export interface WeatherData {
  DATE: string;
  MAX_TEMP: number;
  AVG_WIND_SPEED: number;
  LAGGED_PRECIPITATION: number;
  WIND_TEMP_RATIO: number;
}

export interface FireZone {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  currentWeather?: WeatherData;
  resourceNeedScore?: number;
}

export interface Resource {
  id: string;
  type: 'Truck' | 'Crew' | 'Helicopter' | 'Equipment';
  name: string;
  status: 'available' | 'deployed' | 'maintenance';
  currentLocation: {
    lat: number;
    lng: number;
  };
  assignedZone?: string;
  capabilities: string[];
}

export interface GraphNode {
  id: string;
  type: 'resource' | 'zone';
  data: Resource | FireZone;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export interface FireStation {
  id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  stationNumber: string;
  status: string;
  resources: string[];
  distance?: number;
} 