import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../../../domain/User';

// Extending interface to include Mongoose/DB specific fields like passwordHash
export interface IUserDocument extends Document {
    email: string;
    passwordHash: string;
    name: string;
    preferences: {
        language: string;
        theme: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    preferences: {
        language: { type: String, default: 'en' },
        theme: { type: String, default: 'light' }
    }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
