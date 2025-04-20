import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyRequest extends Document {
  name: string;
  phone: string;
  address: string;
  emergencyType: 'fire' | 'medical' | 'rescue' | 'other';
  description: string;
  status: 'pending' | 'dispatched' | 'completed';
  location: {
    type: string;
    coordinates: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyRequestSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please provide your location'],
    trim: true
  },
  emergencyType: {
    type: String,
    enum: ['fire', 'medical', 'rescue', 'other'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the emergency'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'completed'],
    default: 'pending'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, {
  timestamps: true
});

// Create a geospatial index for location
EmergencyRequestSchema.index({ location: '2dsphere' });

export default mongoose.model<IEmergencyRequest>('EmergencyRequest', EmergencyRequestSchema); 