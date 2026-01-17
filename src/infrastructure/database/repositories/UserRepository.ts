import { IUserRepository } from '../../../../application/repositories/IUserRepository';
import { User } from '../../../../domain/User';
import { UserModel } from '../mongoose/schemas/UserSchema';

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser.toObject();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean().exec();
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean().exec();
  }
}
