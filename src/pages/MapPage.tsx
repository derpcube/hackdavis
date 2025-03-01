import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventMap from '../components/EventMap';
import FilterBar from '../components/FilterBar';
import { useEvents } from '../context/EventContext';
import { Filter } from '../types';
import { PlusCircle } from 'lucide-react';

const MapPage: React.FC = () => {
  const { events } = useEvents();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>({
    category: null,
    date: null,
    searchQuery: '',
  });

  // Apply filters to events
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

  const handleMapClick = () => {
    navigate('/add-event');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Events Map</h1>
        <p className="text-lg text-gray-600 mb-2">Explore events visually and find what's happening near you</p>
        <p className="text-sm text-indigo-600">Click anywhere on the map to add a new event at that location</p>
      </div>
      
      <FilterBar filter={filter} setFilter={setFilter} />
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
            <span className="text-sm">Party</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-1"></div>
            <span className="text-sm">Club</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
            <span className="text-sm">Sports</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-sm">Concert</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-1"></div>
            <span className="text-sm">Other</span>
          </div>
        </div>
        
        <div className="relative">
          <EventMap 
            events={filteredEvents} 
            height="600px" 
            onMapClick={handleMapClick}
            interactive={true}
          />
          
          <button
            onClick={() => navigate('/add-event')}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            aria-label="Add new event"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;