import { Request, Response } from 'express';
import { AuthService } from '../../../application/auth/AuthService';

const authService = new AuthService();

export const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login(email, password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set Session
        (req.session as any).userId = user.id;
        (req.session as any).user = user;
        
        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error("Login Error", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const handleRegister = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const user = await authService.register(email, password, name);
        
        (req.session as any).userId = user.id;
        (req.session as any).user = user;

        res.json({ message: 'Registration successful', user });
    } catch (error: any) {
         res.status(400).json({ error: error.message || 'Registration failed' });
    }
};

export const handleLogout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ message: 'Logged out' });
    });
};

export const getMe = (req: Request, res: Response) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ user });
};
