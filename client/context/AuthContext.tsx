import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { useRouter, useSegments } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

type User = {
    id: string;
    email: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const rootSegment = useSegments()[0];
    const router = useRouter();

    useEffect(() => {
        // Check session on mount
        api.get('/auth/me')
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (isLoading) return;
        
        const inAuthGroup = rootSegment === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, rootSegment, isLoading]);

    const signIn = async (email: string, pass: string) => {
        try {
            console.log(`[Auth] Attempting login...`);
            const { data } = await api.post('/auth/login', {
                email, password: pass
            });
            console.log('[Auth] Login success', data);
            setUser(data.user);
        } catch (error: any) {
            console.error('[Auth] Login failed:', error.message);
            if (error.response) {
                console.error('[Auth] Server Error Data:', error.response.data);
                console.error('[Auth] Status:', error.response.status);
                throw new Error(error.response.data.error || `Server Error: ${error.response.status}`);
            } else if (error.request) {
                console.error('[Auth] No response received from server');
                throw new Error("Network Error: Could not connect to server. Check your internet or API URL.");
            } else {
                throw new Error(error.message);
            }
        }
    };

    const signUp = async (email: string, pass: string, name: string) => {
        try {
             console.log(`[Auth] Attempting register...`);
            const { data } = await api.post('/auth/register', {
                 email, password: pass, name
            });
            setUser(data.user);
        } catch (error: any) {
            console.error('[Auth] Register failed:', error);
             if (error.response) {
                throw new Error(error.response.data.error || `Server Error: ${error.response.status}`);
            }
            throw new Error("Registration Failed: " + error.message);
        }
    };

    const signOut = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
