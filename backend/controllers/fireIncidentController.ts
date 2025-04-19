import { Request, Response } from 'express';
import FireIncident from '../models/FireIncident';
import axios from 'axios';

// Function to get coordinates from address using OpenStreetMap Nominatim API
async function getCoordinatesFromAddress(address: string): Promise<[number, number]> {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1
      }
    });

    if (response.data && response.data[0]) {
      return [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)];
    }
    throw new Error('Address not found');
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}

export const reportIncident = async (req: Request, res: Response) => {
  try {
    const { address, timestamp, description } = req.body;

    // Get coordinates from address
    const coordinates = await getCoordinatesFromAddress(address);

    const incident = await FireIncident.create({
      address,
      timestamp: new Date(timestamp),
      description,
      location: {
        type: 'Point',
        coordinates
      }
    });

    res.status(201).json({
      success: true,
      data: incident
    });
  } catch (error) {
    console.error('Error reporting incident:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to report incident'
    });
  }
};

export const getIncidents = async (req: Request, res: Response) => {
  try {
    const incidents = await FireIncident.find().sort({ createdAt: -1 });
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