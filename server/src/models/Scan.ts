import { Schema, model, Document } from 'mongoose';

interface IFlaggedItem {
  item: string;
  claimedPrice: number;
  marketPrice: number;
  reason: string;
}

export interface IScan extends Document {
  fraudScore: number;
  summary: string;
  flaggedItems: IFlaggedItem[];
  originalImage: string; // Path or URL to the uploaded image
  createdAt: Date;
  deviceId?: string;
}

const FlaggedItemSchema = new Schema<IFlaggedItem>({
  item: { type: String, required: true },
  claimedPrice: { type: Number, required: true },
  marketPrice: { type: Number, required: true },
  reason: { type: String, required: true },
});

const ScanSchema = new Schema<IScan>({
  fraudScore: { type: Number, required: true },
  summary: { type: String, required: true },
  flaggedItems: [FlaggedItemSchema],
  originalImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deviceId: { type: String, index: true },
});


export const Scan = model<IScan>('Scan', ScanSchema);
