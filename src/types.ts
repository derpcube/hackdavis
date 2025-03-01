export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
  category: 'party' | 'club' | 'sports' | 'concert' | 'other';
  image: string;
  organizer: string;
}

export interface Filter {
  category: string | null;
  date: string | null;
  searchQuery: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  category: 'party' | 'club' | 'sports' | 'concert' | 'other';
  image: string;
  organizer: string;
}