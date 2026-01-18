import mongoose, { Schema } from 'mongoose';
import { User } from '../../../../domain/entities/User';

export const UserSchema = new Schema<User & { passwordHash?: string }>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  mobile: { type: String },
  pan: { type: String },
  tier: { type: String, enum: ['free', 'premium'], default: 'free' },
  passwordHash: { type: String },
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<User & { passwordHash?: string }>('User', UserSchema);
