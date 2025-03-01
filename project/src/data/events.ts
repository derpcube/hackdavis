import { Event } from '../types';

export const events: Event[] = [
  {
    id: '1',
    title: 'Summer Beach Party',
    description: 'Join us for the hottest beach party of the summer! Live DJs, food, drinks, and games.',
    date: '2025-07-15',
    time: '14:00',
    location: {
      name: 'Sunset Beach',
      address: '123 Coastal Highway, Beach City',
      coordinates: [40.7128, -74.0060], // New York coordinates for demo
    },
    category: 'party',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Beach Events Co.',
  },
  {
    id: '2',
    title: 'Downtown Book Club Meeting',
    description: 'Monthly meeting to discuss "The Midnight Library" by Matt Haig. New members welcome!',
    date: '2025-06-20',
    time: '18:30',
    location: {
      name: 'Central Library',
      address: '45 Reading Street, Downtown',
      coordinates: [40.7282, -73.9942], // Slightly different NYC coordinates
    },
    category: 'club',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Downtown Book Lovers',
  },
  {
    id: '3',
    title: 'City Marathon 2025',
    description: 'Annual city marathon with 5K, 10K, half marathon and full marathon options.',
    date: '2025-08-10',
    time: '07:00',
    location: {
      name: 'City Park',
      address: '1 Park Avenue, Metro City',
      coordinates: [40.7580, -73.9855], // Another NYC area
    },
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Metro Sports Association',
  },
  {
    id: '4',
    title: 'Indie Rock Night',
    description: 'Featuring three local bands and special guest performers. Food trucks and craft beer available.',
    date: '2025-06-25',
    time: '20:00',
    location: {
      name: 'The Sound Garden',
      address: '789 Music Avenue, Rockville',
      coordinates: [40.7484, -73.9857], // NYC area
    },
    category: 'concert',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Independent Music Collective',
  },
  {
    id: '5',
    title: 'Tech Startup Networking',
    description: 'Connect with local entrepreneurs, investors, and tech enthusiasts. Pitch your ideas!',
    date: '2025-07-05',
    time: '17:00',
    location: {
      name: 'Innovation Hub',
      address: '555 Tech Boulevard, Silicon Hills',
      coordinates: [40.7549, -73.9840], // NYC area
    },
    category: 'other',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'TechConnect',
  },
  {
    id: '6',
    title: 'Community Soccer Tournament',
    description: 'Annual 5-a-side soccer tournament for all ages and skill levels. Prizes for winners!',
    date: '2025-07-22',
    time: '09:00',
    location: {
      name: 'Community Sports Complex',
      address: '42 Athletic Drive, Sportsville',
      coordinates: [40.7228, -74.0077], // NYC area
    },
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Community Sports League',
  }
];