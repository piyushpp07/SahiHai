import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { RewardCard } from '../components/RewardCard';

export default function RewardsScreen() {
  const mockRewards = [
    { id: '1', title: 'Daily Bonus', amount: 50, status: 'AVAILABLE' },
    { id: '2', title: 'First Chat', amount: 100, status: 'CLAIMED' },
    { id: '3', title: 'Referral', amount: 250, status: 'LOCKED' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Loot & Rewards', headerShadowVisible: false }} />
      <ScrollView className="flex-1 bg-gray-50 px-6 pt-6">
        <View className="mb-8">
            <Text className="text-3xl font-black text-gray-900">Your Loot</Text>
            <Text className="text-gray-500 font-medium mt-1">Total points earned: 150</Text>
        </View>

        {mockRewards.map(reward => (
            <View key={reward.id} className={`p-6 rounded-[32px] mb-4 border ${reward.status === 'LOCKED' ? 'bg-gray-100 border-gray-200' : 'bg-white border-blue-50 shadow-sm'}`}>
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className={`font-bold text-lg ${reward.status === 'LOCKED' ? 'text-gray-400' : 'text-gray-900'}`}>{reward.title}</Text>
                        <Text className="text-blue-600 font-black text-xl">₹{reward.amount}</Text>
                    </View>
                    <Pressable 
                        className={`px-6 py-3 rounded-2xl ${reward.status === 'AVAILABLE' ? 'bg-blue-600' : 'bg-gray-200'}`}
                        disabled={reward.status !== 'AVAILABLE'}
                    >
                        <Text className={`font-bold ${reward.status === 'AVAILABLE' ? 'text-white' : 'text-gray-400'}`}>
                            {reward.status === 'AVAILABLE' ? 'Claim Now' : reward.status}
                        </Text>
                    </Pressable>
                </View>
            </View>
        ))}

        <Text className="mt-8 text-gray-400 text-center italic mb-10">
            Keep using SahiHai to unlock more premium loot!
        </Text>
      </ScrollView>
    </>
  );
}

