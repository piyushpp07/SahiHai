import { UserModel } from '../../infrastructure/database/mongoose/models/UserModel';
import bcrypt from 'bcryptjs';
import { User } from '../../domain/User';

export class AuthService {
    
    async login(email: string, password: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash || '');
        if (!isValid) return null;
        
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            preferences: user.preferences
        };
    }


    async register(email: string, password: string, name: string): Promise<User> {
         // Check if exists
         const existing = await UserModel.findOne({ email });
         if (existing) throw new Error("User already exists");

         const passwordHash = await bcrypt.hash(password, 10);
         
         const newUser = await UserModel.create({
             email,
             name,
             passwordHash, // Ensure model supports this field or ignored if schema strict
             preferences: { language: 'en', theme: 'light' }
         });

         return {
             id: newUser.id,
             name: newUser.name,
             email: newUser.email,
             preferences: newUser.preferences
         };
    }
}
