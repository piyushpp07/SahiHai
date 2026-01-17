import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { GoldRateWidget } from '../components/GoldRateWidget';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4 text-blue-600">SahiHai - Everyday Assistant</Text>
      
      <View className="w-full mb-8">
        <GoldRateWidget />
      </View>

      <Link href="/chat/new" asChild>
        <Pressable className="bg-blue-500 px-6 py-3 rounded-full active:bg-blue-600">
             <Text className="text-white font-semibold">Start Chat</Text>
        </Pressable>
      </Link>
    </View>
  );
}


