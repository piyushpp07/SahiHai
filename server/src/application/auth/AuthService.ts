import { UserModel } from '../../infrastructure/database/mongoose/schemas/UserSchema';
import bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/User';

export class AuthService {
    
    async login(email: string, password: string): Promise<User | null> {
        const user = await UserModel.findOne({ email }).lean() as any;
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash || '');
        if (!isValid) return null;
        
        const { _id, ...rest } = user;
        return { id: _id.toString(), ...rest } as User;
    }


    async register(email: string, password: string, name: string): Promise<User> {
         // Check if exists
         const existing = await UserModel.findOne({ email });
         if (existing) throw new Error("User already exists");

         const passwordHash = await bcrypt.hash(password, 10);
         
         const newUser = await UserModel.create({
             email,
             name,
             passwordHash,
             tier: 'free',
             preferences: { language: 'en', theme: 'light' },
             createdAt: new Date()
         });

         const doc = newUser.toObject();
         const { _id, ...rest } = doc;
         return { id: _id.toString(), ...rest } as User;
    }
}
