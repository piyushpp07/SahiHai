import { Schema } from 'mongoose';
import { Transaction } from '../../../../domain/entities/Transaction';

export const TransactionSchema = new Schema<Transaction>({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  type: { type: String, enum: ['payment', 'reward'], required: true },
  description: { type: String },
  metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
