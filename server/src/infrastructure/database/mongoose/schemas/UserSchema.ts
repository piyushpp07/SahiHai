import { Schema } from 'mongoose';
import { User } from '../../../../domain/entities/User';

export const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  mobile: { type: String },
  pan: { type: String },
  tier: { type: String, enum: ['free', 'premium'], default: 'free' },
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
