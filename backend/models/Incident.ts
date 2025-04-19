import mongoose, { Schema, Document } from 'mongoose';

export interface IIncident extends Document {
  address: string;
  description: string;
  status: 'active' | 'resolved';
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema: Schema = new Schema({
  address: {
    type: String,
    required: [true, 'Please provide an address'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
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
IncidentSchema.index({ location: '2dsphere' });

export default mongoose.model<IIncident>('Incident', IncidentSchema); 