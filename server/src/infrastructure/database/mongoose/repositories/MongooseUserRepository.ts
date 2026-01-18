import { User } from '../../../../domain/entities/User';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserModel } from '../schemas/UserSchema';

export class MongooseUserRepository implements IUserRepository {
  private mapUser(doc: any): User | null {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest } as User;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean();
    return this.mapUser(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    return this.mapUser(doc);
  }

  async save(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const saved = await newUser.save();
    return this.mapUser(saved.toObject())!;
  }

  async update(user: User): Promise<User> {
    const updated = await UserModel.findByIdAndUpdate(user.id, user, { new: true }).lean();
    if (!updated) throw new Error('User not found');
    return this.mapUser(updated)!;
  }
}
