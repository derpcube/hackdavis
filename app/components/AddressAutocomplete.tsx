'use client';

import React, { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    let mounted = true;

    const initializeAutocomplete = async () => {
      try {
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
      }
    };

    initializeAutocomplete();

    return () => {
      mounted = false;
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [onSelect]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded text-black bg-white"
        placeholder="Enter fire location address"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 