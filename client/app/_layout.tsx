import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config" // Optional if you have a custom config
import { Stack } from 'expo-router';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config}>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'SahiHai' }} />
                <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
            </Stack>
        </GluestackUIProvider>
    </QueryClientProvider>
  );
}
