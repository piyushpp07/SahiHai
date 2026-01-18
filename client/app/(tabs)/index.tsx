import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GoldRateWidget } from '../../components/GoldRateWidget';
import { Lootmeter } from '../../components/ui/Lootmeter';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-10">
            <View>
                <Text className="text-gray-400 font-bold text-[10px] tracking-[2px] uppercase mb-1">Elite Engine 2.0</Text>
                <Text className="text-2xl font-black text-gray-900">{user?.name || 'Explorer'}</Text>
            </View>
            <Pressable 
                onPress={() => signOut()} 
                className="bg-gray-100 w-12 h-12 rounded-2xl items-center justify-center border border-gray-200"
            >
                <Ionicons name="log-out" size={20} color="#374151" />
            </Pressable>
        </View>

        {/* Security Pulse: Lootmeter */}
        <View className="mb-8">
            <Lootmeter />
        </View>

        {/* Bento Grid Layout */}
        <View className="flex-row flex-wrap justify-between">
            
            {/* Primary Action: AI Chat */}
            <Link href="/(tabs)/chat" asChild>
                <Pressable className="w-full mb-4">
                    <LinearGradient
                        colors={['#4F46E5', '#3730A3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 40, padding: 32 }}
                        className="shadow-2xl shadow-indigo-200"
                    >
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="text-white/60 font-bold uppercase tracking-[2px] text-[10px] mb-3">Active Assistant</Text>
                                <Text className="text-white text-xl font-black mb-2">Ask SahiHai</Text>
                                <Text className="text-indigo-100 text-sm opacity-80 leading-5">Your hyper-local engine for transit, laws, and payments.</Text>
                            </View>
                            <View className="bg-white/10 w-16 h-16 rounded-[24px] items-center justify-center border border-white/20">
                                <Ionicons name="sparkles" size={32} color="white" />
                            </View>
                        </View>
                    </LinearGradient>
                </Pressable>
            </Link>

            {/* Quick Ticker (Gold) */}
            <View className="w-full mb-4">
               <GoldRateWidget />
            </View>

            {/* Second Row: Two Squares */}
            <Link href="/tools/challan" asChild>
                <Pressable className="w-[48%] aspect-square mb-4">
                    <GlassCard intensity={10} className="flex-1 bg-red-50/50 border-red-100">
                        <View className="bg-red-500 w-12 h-12 rounded-2xl items-center justify-center mb-4">
                            <Ionicons name="car-outline" size={24} color="white" />
                        </View>
                        <Text className="text-red-900 font-black text-lg">Challan</Text>
                        <Text className="text-red-600/70 text-xs font-bold">Check Fines</Text>
                    </GlassCard>
                </Pressable>
            </Link>

            <Link href="/tools/pnr" asChild>
                <Pressable className="w-[48%] aspect-square mb-4">
                    <GlassCard intensity={10} className="flex-1 bg-blue-50/50 border-blue-100">
                        <View className="bg-blue-600 w-12 h-12 rounded-2xl items-center justify-center mb-4">
                            <Ionicons name="train-outline" size={24} color="white" />
                        </View>
                        <Text className="text-blue-900 font-black text-lg">PNR</Text>
                        <Text className="text-blue-600/70 text-xs font-bold">Train Status</Text>
                    </GlassCard>
                </Pressable>
            </Link>

            {/* Rewards Card */}
            <Link href="/tools/rewards" asChild>
                <Pressable className="w-full mb-4">
                    <GlassCard intensity={5} className="bg-emerald-50/50 border-emerald-100">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="bg-emerald-500 w-14 h-14 rounded-full items-center justify-center mr-4">
                                    <Ionicons name="gift" size={28} color="white" />
                                </View>
                                <View>
                                    <Text className="text-emerald-900 font-black text-xl">Loot & Rewards</Text>
                                    <Text className="text-emerald-600 font-bold">₹150 Earned this week</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#10B981" />
                        </View>
                    </GlassCard>
                </Pressable>
            </Link>

        </View>

      </ScrollView>

      {/* Persistent Lootmeter Floating Badge (Blueprint) */}
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <Pressable className="bg-black px-8 py-4 rounded-full flex-row items-center shadow-2xl">
            <Text className="text-white font-black uppercase tracking-tighter mr-2">🚨 Lootmeter</Text>
            <View className="bg-red-500 w-2 h-2 rounded-full" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
