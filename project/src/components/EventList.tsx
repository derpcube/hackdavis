import React from 'react';
import EventCard from './EventCard';
import { Event, Filter } from '../types';

interface EventListProps {
  events: Event[];
  filter: Filter;
}

const EventList: React.FC<EventListProps> = ({ events, filter }) => {
  const filteredEvents = events.filter(event => {
    // Filter by category
    if (filter.category && filter.category !== 'all' && event.category !== filter.category) {
      return false;
    }
    
    // Filter by date
    if (filter.date && event.date !== filter.date) {
      return false;
    }
    
    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.name.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No events found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;