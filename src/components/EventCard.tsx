import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = format(new Date(event.date), 'MMM dd, yyyy');
  
  const categoryColors = {
    party: 'bg-pink-100 text-pink-800',
    club: 'bg-purple-100 text-purple-800',
    sports: 'bg-green-100 text-green-800',
    concert: 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800'
  };
  
  const categoryColor = categoryColors[event.category];

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`${categoryColor} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">{formattedDate}</span>
          <Clock className="h-4 w-4 ml-3 mr-1" />
          <span className="text-sm">{event.time}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{event.location.name}</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <Link 
          to={`/event/${event.id}`} 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;