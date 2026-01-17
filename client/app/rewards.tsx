import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { RewardCard } from '../components/RewardCard';

export default function RewardsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Your Rewards' }} />
      <View className="flex-1 items-center justify-center bg-gray-100 p-4">
        <Text className="text-xl font-bold mb-8 text-blue-800">Scratch & Win!</Text>
        <RewardCard amount={50} onScratch={() => console.log('Scratched!')} />
        <Text className="mt-8 text-gray-500 text-center">
            Earn more scratch cards by referring friends!
        </Text>
      </View>
    </>
  );
}
