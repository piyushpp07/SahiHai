import { View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { GoldRateWidget } from '../components/GoldRateWidget';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
            <View>
                <Text className="text-gray-500 font-medium text-sm">Good Morning,</Text>
                <Text className="text-2xl font-bold text-gray-900">{user?.name || 'Explorer'}</Text>
            </View>
            <Pressable onPress={() => signOut()} className="bg-gray-200 px-4 py-2 rounded-full">
                <Text className="text-gray-700 font-semibold text-xs">Logout</Text>
            </Pressable>
        </View>

        {/* Lootmeter Feature (Requested) */}
        <View className="bg-red-500 rounded-2xl p-6 mb-8 shadow-md">
            <Text className="text-white font-bold text-lg mb-1">🚨 Lootmeter Check</Text>
            <Text className="text-red-100 text-sm mb-4">Verify if a deal or call is a scam instantly.</Text>
            <Pressable className="bg-white px-4 py-3 rounded-lg flex-row justify-center items-center">
                <Text className="text-red-600 font-bold">Check Now</Text>
            </Pressable>
        </View>

        {/* Utilities Section */}
        <Text className="text-lg font-bold text-gray-800 mb-4">Daily Updates</Text>
        <View className="mb-8">
            <GoldRateWidget />
        </View>

        {/* Quick Actions Grid */}
        <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between">
             <Link href="/chat/new" asChild>
                <Pressable className="bg-blue-600 w-[48%] aspect-square rounded-2xl p-4 justify-between mb-4 shadow-sm active:opacity-90">
                     <View className="bg-blue-500/30 w-10 h-10 rounded-full items-center justify-center">
                        <Text className="text-2xl">💬</Text>
                     </View>
                     <Text className="text-white font-bold text-lg">AI Chat</Text>
                </Pressable>
             </Link>

             <Link href="/rewards" asChild>
                <Pressable className="bg-purple-600 w-[48%] aspect-square rounded-2xl p-4 justify-between mb-4 shadow-sm active:opacity-90">
                     <View className="bg-purple-500/30 w-10 h-10 rounded-full items-center justify-center">
                        <Text className="text-2xl">🎁</Text>
                     </View>
                     <Text className="text-white font-bold text-lg">Rewards</Text>
                </Pressable>
             </Link>

             {/* Placeholder for future features */}
             <Pressable className="bg-white w-[48%] aspect-square rounded-2xl p-4 justify-between mb-4 border border-gray-100 shadow-sm">
                 <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center">
                    <Text className="text-2xl">🚗</Text>
                 </View>
                 <Text className="text-gray-800 font-bold text-lg">Challan</Text>
             </Pressable>

             <Pressable className="bg-white w-[48%] aspect-square rounded-2xl p-4 justify-between mb-4 border border-gray-100 shadow-sm">
                 <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center">
                    <Text className="text-2xl">🚆</Text>
                 </View>
                 <Text className="text-gray-800 font-bold text-lg">PNR</Text>
             </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}



