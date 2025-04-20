'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelect: (address: string, lat: number, lng: number) => void;
}

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

// Keep track of whether the script has been loaded
let scriptLoaded = false;
let loadingPromise: Promise<void> | null = null;

const loadGooglePlacesScript = (): Promise<void> => {
  if (scriptLoaded) {
    return Promise.resolve();
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      loadingPromise = null;
      resolve();
    };
    script.onerror = () => {
      loadingPromise = null;
      reject(new Error('Failed to load Google Places API'));
    };
    document.head.appendChild(script);
  });

  return loadingPromise;
};

export default function AddressAutocomplete({ value, onChange, onSelect }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAutocomplete = async () => {
      try {
        setIsLoading(true);
        await loadGooglePlacesScript();
        
        if (!mounted || !inputRef.current) return;

        // Create the autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'geometry']
        });

        // Add place changed listener
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address && place.geometry?.location) {
            onSelect(
              place.formatted_address,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );
          }
        });

        setError(null);
      } catch (err) {
        if (mounted) {
          setError('Failed to load address autocomplete. Please try again.');
          console.error('Error initializing Google Places:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAutocomplete();

    return () => {
      mounted = false;
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [onSelect]);

  // Simplified input change handler to fix typing issues
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <MapPinIcon className="h-5 w-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          className="block w-full rounded-lg bg-[#2A303C]/60 border-gray-700/50 text-white shadow-sm focus:border-red-500 focus:ring-red-500/30 sm:text-sm pl-10 pr-3 py-3 transition-all placeholder:text-gray-500"
          placeholder="Enter incident location"
          disabled={isLoading}
          autoComplete="off" // This helps prevent browser autocomplete from interfering
        />
      </div>
      {isLoading && (
        <div className="mt-2 flex items-center gap-2 text-gray-400 text-sm">
          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
          <span>Loading address service...</span>
        </div>
      )}
      {error && (
        <p className="text-red-400 text-sm mt-1 bg-red-500/10 p-2 rounded-md">
          {error}
        </p>
      )}
    </div>
  );
}