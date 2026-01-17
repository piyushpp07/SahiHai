import mongoose from 'mongoose';
import { User } from '../../../../domain/entities/User';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserSchema } from '../schemas/UserSchema';

const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export class MongooseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean();
  }

  async save(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const saved = await newUser.save();
    return saved.toObject();
  }

  async update(user: User): Promise<User> {
    const updated = await UserModel.findByIdAndUpdate(user.id, user, { new: true }).lean();
    if (!updated) throw new Error('User not found');
    return updated;
  }
}
