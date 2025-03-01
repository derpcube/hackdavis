import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import EventDetailPage from './pages/EventDetailPage';
import AddEventPage from './pages/AddEventPage';
import { EventProvider } from './context/EventContext';

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />
              <Route path="/add-event" element={<AddEventPage />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold">EventFinder</h3>
                  <p className="text-gray-400">Discover amazing events near you</p>
                </div>
                <div className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} EventFinder. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;