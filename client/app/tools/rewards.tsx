import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { GlassCard } from '../../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RewardsScreen() {
  const mockRewards = [
    { id: '1', title: 'Daily Bonus', amount: 50, status: 'AVAILABLE', icon: 'sparkles' },
    { id: '2', title: 'First Chat', amount: 100, status: 'CLAIMED', icon: 'chatbubble' },
    { id: '3', title: 'Referral', amount: 250, status: 'LOCKED', icon: 'people' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ title: 'Loot', headerShadowVisible: false }} />
      
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-10">
            <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Earnings</Text>
            <Text className="text-5xl font-black text-gray-900 mb-2">₹150</Text>
            <Text className="text-emerald-500 font-bold">Safe Wealth Score: 850</Text>
        </View>

        {mockRewards.map(reward => (
            <View key={reward.id} className="mb-4">
                <GlassCard 
                    intensity={reward.status === 'LOCKED' ? 2 : 10} 
                    className={`border ${reward.status === 'LOCKED' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-indigo-100'}`}
                >
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center flex-1">
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${reward.status === 'LOCKED' ? 'bg-gray-200' : 'bg-indigo-600'}`}>
                                <Ionicons name={reward.icon as any} size={28} color={reward.status === 'LOCKED' ? '#9CA3AF' : 'white'} />
                            </View>
                            <View className="flex-1">
                                <Text className={`font-black text-xl ${reward.status === 'LOCKED' ? 'text-gray-400' : 'text-gray-900'}`}>{reward.title}</Text>
                                <Text className={`font-bold ${reward.status === 'LOCKED' ? 'text-gray-300' : 'text-indigo-600'}`}>₹{reward.amount}</Text>
                            </View>
                        </View>
                        
                        <Pressable 
                            className={`px-6 py-3 rounded-full ${reward.status === 'AVAILABLE' ? 'bg-indigo-600' : 'bg-transparent'}`}
                            disabled={reward.status !== 'AVAILABLE'}
                        >
                            <Text className={`font-bold uppercase tracking-widest text-[10px] ${reward.status === 'AVAILABLE' ? 'text-white' : 'text-gray-400'}`}>
                                {reward.status === 'AVAILABLE' ? 'Claim' : reward.status}
                            </Text>
                        </Pressable>
                    </View>
                </GlassCard>
            </View>
        ))}

        <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            className="rounded-[40px] p-8 mt-6 shadow-2xl items-center"
        >
            <Text className="text-white/70 font-bold uppercase tracking-widest text-[10px] mb-2">Invite Friends</Text>
            <Text className="text-white text-2xl font-black text-center mb-6">Earn up to ₹500 per referral</Text>
            <Pressable className="bg-white px-10 py-4 rounded-full">
                <Text className="text-indigo-600 font-black uppercase tracking-widest text-xs">Share Link</Text>
            </Pressable>
        </LinearGradient>

        <View className="py-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
