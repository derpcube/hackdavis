import React, { useState } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { MapPin, Search, X } from 'lucide-react';

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  initialValue?: string;
  error?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ 
  onAddressSelect, 
  initialValue = '',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      componentRestrictions: { country: 'us' }, // Limit to US addresses
    },
    debounce: 300,
    defaultValue: initialValue
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = async (suggestion: google.maps.places.AutocompletePrediction) => {
    // When user selects a place, update the input value and get the details
    setValue(suggestion.description, false);
    clearSuggestions();
    setIsOpen(false);

    try {
      // Get latitude and longitude from the address
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      
      // Call the callback with the selected address and coordinates
      onAddressSelect(suggestion.description, [lat, lng]);
    } catch (error) {
      console.error("Error selecting address:", error);
    }
  };

  const handleClear = () => {
    setValue('');
    clearSuggestions();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Enter an address..."
          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          onFocus={() => value && setIsOpen(true)}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {/* Suggestions dropdown */}
      {isOpen && status === "OK" && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {data.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 text-gray-900"
            >
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <span className="block truncate">{suggestion.description}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default AddressAutocomplete;