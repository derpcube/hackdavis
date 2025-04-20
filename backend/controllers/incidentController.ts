import { Request, Response } from 'express';
import Incident from '../models/Incident';
import axios from 'axios';

// Function to get coordinates from address using OpenStreetMap Nominatim API
async function getCoordinatesFromAddress(address: string): Promise<[number, number]> {
  try {
    // Add a delay to respect Nominatim's usage policy
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Format the address for the API
    const formattedAddress = encodeURIComponent(address);
    
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: formattedAddress,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'FireSphere Emergency Response System'
      }
    });

    console.log('Nominatim API response:', response.data);

    if (response.data && response.data[0]) {
      const coordinates: [number, number] = [
        parseFloat(response.data[0].lon),
        parseFloat(response.data[0].lat)
      ];
      
      if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
        throw new Error('Invalid coordinates returned from geocoding service');
      }
      
      return coordinates;
    }
    throw new Error('Could not find coordinates for the provided address. Please check the address and try again.');
  } catch (error) {
    console.error('Error getting coordinates:', error);
    if (error instanceof Error) {
      throw new Error(`Address geocoding failed: ${error.message}`);
    }
    throw new Error('Failed to process the address. Please try again.');
  }
}

export const createIncident = async (req: Request, res: Response) => {
  try {
    console.log('Received incident data:', req.body);
    const { address, description, timestamp } = req.body;

    if (!address || !description) {
      console.error('Missing required fields:', { address, description });
      return res.status(400).json({
        success: false,
        error: 'Address and description are required'
      });
    }

    // Skip geocoding and use default coordinates for Davis, CA
    const coordinates: [number, number] = [-121.7405, 38.5449];
    
    console.log('Creating incident with data:', {
      address,
      description,
      timestamp,
      coordinates
    });

    const incident = await Incident.create({
      address,
      description,
      timestamp,
      status: 'active',
      location: {
        type: 'Point',
        coordinates
      }
    });

    console.log('Successfully created incident:', incident);

    res.status(201).json({
      success: true,
      data: incident
    });
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create incident'
    });
  }
};

export const getIncidents = async (req: Request, res: Response) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: incidents
    });
  } catch (error) {
    console.error('Error getting incidents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get incidents'
    });
  }
}; 