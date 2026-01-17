import { Schema, model, Document } from 'mongoose';
import { Vehicle } from '../../../../domain/Vehicle';

const VehicleSchema = new Schema<Vehicle & Document>({
  userId: { type: String, required: true },
  registrationNumber: { type: String, required: true },
});

export const VehicleModel = model<Vehicle & Document>('Vehicle', VehicleSchema);
