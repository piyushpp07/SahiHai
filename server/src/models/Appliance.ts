import { Schema, model, Document } from 'mongoose';

export interface IAppliance extends Document {
  brand: string;
  model: string;
  serial: string;
  age_years: number;
  is_warranty_likely_expired: boolean;
  maintenance_tip: string;
  createdAt: Date;
  deviceId?: string;
}

const ApplianceSchema = new Schema<IAppliance>({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  serial: { type: String, required: true },
  age_years: { type: Number, required: true },
  is_warranty_likely_expired: { type: Boolean, required: true },
  maintenance_tip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deviceId: { type: String, index: true },
});

export const Appliance = model<IAppliance>('Appliance', ApplianceSchema);
