import mongoose, { Schema, Document } from 'mongoose';

export interface IFireIncident extends Document {
  address: string;
  timestamp: Date;
  description: string;
  status: 'reported' | 'verified' | 'contained' | 'extinguished';
  location: {
    type: string;
    coordinates: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const FireIncidentSchema: Schema = new Schema({
  address: {
    type: String,
    required: [true, 'Please provide an address'],
    trim: true
  },
  timestamp: {
    type: Date,
    required: [true, 'Please provide when the fire occurred']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the incident'],
    trim: true
  },
  status: {
    type: String,
    enum: ['reported', 'verified', 'contained', 'extinguished'],
    default: 'reported'
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
FireIncidentSchema.index({ location: '2dsphere' });

export default mongoose.model<IFireIncident>('FireIncident', FireIncidentSchema); 