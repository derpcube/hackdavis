import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ArrowLeft, Map } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { format } from 'date-fns';
import EventMap from '../components/EventMap';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEvents();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link 
        to="/"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Events
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-64 md:h-96 relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full mb-2">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
              <span>{event.location.name}, {event.location.address}</span>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              <span>Organized by {event.organizer}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <EventMap events={[event]} height="100%" />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Link 
              to="/map"
              className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
            >
              <Map className="w-4 h-4 mr-2" />
              View All Events on Map
            </Link>
            
            <button 
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Register for Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;