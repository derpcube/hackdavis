import React, { useState } from 'react';
import EventList from '../components/EventList';
import FilterBar from '../components/FilterBar';
import { useEvents } from '../context/EventContext';
import { Filter } from '../types';

const HomePage: React.FC = () => {
  const { events } = useEvents();
  const [filter, setFilter] = useState<Filter>({
    category: null,
    date: null,
    searchQuery: '',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Discover Amazing Events</h1>
        <p className="text-lg text-gray-600">Find parties, club activities, sports events, and more in your area</p>
      </div>
      
      <FilterBar filter={filter} setFilter={setFilter} />
      
      <EventList events={events} filter={filter} />
    </div>
  );
};

export default HomePage;