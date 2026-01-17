import { Schema, model, Document } from 'mongoose';
import { User } from '../../../../domain/User';

const UserSchema = new Schema<User & Document>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferredLLMProvider: { type: String },
});

export const UserModel = model<User & Document>('User', UserSchema);
