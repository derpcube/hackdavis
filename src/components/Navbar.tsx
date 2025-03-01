import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Map, Home, PlusCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8" />
              <span className="font-bold text-xl">EventFinder</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/map" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition">
              <Map className="h-5 w-5 mr-1" />
              <span>Map</span>
            </Link>
            <Link to="/add-event" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition">
              <PlusCircle className="h-5 w-5 mr-1" />
              <span>Add Event</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;