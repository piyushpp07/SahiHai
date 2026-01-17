import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { Stack } from 'expo-router';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config}>
            <AuthProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ title: 'SahiHai', headerShown: false }} />
                    <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
                    <Stack.Screen name="auth/login" options={{ title: 'Login', headerShown: false }} />
                    <Stack.Screen name="auth/register" options={{ title: 'Sign Up', headerShown: false }} />
                    <Stack.Screen name="rewards" options={{ title: 'My Rewards' }} />
                </Stack>
            </AuthProvider>
        </GluestackUIProvider>
    </QueryClientProvider>
  );
}

