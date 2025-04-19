import { Request, Response } from 'express';
import EmergencyRequest from '../models/EmergencyRequest';
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

export const createEmergencyRequest = async (req: Request, res: Response) => {
  try {
    const { name, phone, address, emergencyType, description } = req.body;

    // Get coordinates from address
    const coordinates = await getCoordinatesFromAddress(address);

    const request = await EmergencyRequest.create({
      name,
      phone,
      address,
      emergencyType,
      description,
      location: {
        type: 'Point',
        coordinates
      }
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error creating emergency request:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create emergency request'
    });
  }
};

export const getEmergencyRequests = async (req: Request, res: Response) => {
  try {
    const requests = await EmergencyRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error getting emergency requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get emergency requests'
    });
  }
}; 