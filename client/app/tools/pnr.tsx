import { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { usePNR } from '../../hooks/usePNR';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EliteInput } from '../../components/ui/EliteInput';

export default function PNRScreen() {
    const [pnr, setPnr] = useState('');
    const { data: status, isLoading, refetch } = usePNR(pnr);

    const handleSearch = () => {
        if (pnr.length === 10) {
            refetch();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <Stack.Screen options={{ title: 'Transit Center', headerShadowVisible: false }} />
            
            <View className="px-4 pt-4 pb-12">
                <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-[2px] mb-3">Railways Intelligence</Text>
                <Text className="text-2xl font-black text-gray-900 mb-8 leading-tight">Check PNR{"\n"}Status</Text>
                
                <EliteInput
                    icon="ticket"
                    iconColor="#2563eb"
                    placeholder="10-digit PNR"
                    value={pnr}
                    onChangeText={setPnr}
                    keyboardType="number-pad"
                    maxLength={10}
                    rightElement={
                        <Pressable 
                            onPress={handleSearch}
                            style={({ pressed }) => [{
                                opacity: pressed ? 0.9 : 1,
                                transform: [{ scale: pressed ? 0.94 : 1 }],
                            }]}
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#1E4ED8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-14 h-14 rounded-[22px] items-center justify-center shadow-lg shadow-blue-400"
                            >
                                <Ionicons name="chevron-forward" size={24} color="white" />
                            </LinearGradient>
                        </Pressable>
                    }
                />
            </View>

            <ScrollView className="flex-1 px-4">
                {isLoading && <ActivityIndicator size="large" color="#2563eb" className="mt-10" />}
                
                {status ? (
                    <View className="mb-10">
                        <LinearGradient
                            colors={['#1E293B', '#0F172A']}
                            className="rounded-[40px] p-8 shadow-2xl overflow-hidden"
                        >
                            <View className="flex-row justify-between items-start mb-10">
                                <View>
                                    <Text className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Status</Text>
                                    <Text className="text-white text-3xl font-black">{(status as any).status}</Text>
                                </View>
                                <Ionicons name="train" size={40} color="white" />
                            </View>

                            <View className="flex-row justify-between mb-8">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase mb-1">Train</Text>
                                    <Text className="text-white font-bold text-lg" numberOfLines={1}>{(status as any).trainName}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase mb-1">Date</Text>
                                    <Text className="text-white font-bold text-lg">{(status as any).date}</Text>
                                </View>
                            </View>

                            <View className="bg-white/10 p-6 rounded-[32px] items-center border border-white/10">
                                <Text className="text-blue-300 text-[10px] font-bold uppercase mb-2">Confirmation Probability</Text>
                                <View className="flex-row items-baseline">
                                    <Text className="text-3xl font-black text-white">{(status as any).probability}</Text>
                                    <Text className="text-xl font-bold text-blue-400 ml-1">%</Text>
                                </View>
                                <View className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
                                    <View className="bg-blue-500 h-full" style={{ width: `${(status as any).probability}%` as any }} />
                                </View>
                            </View>
                        </LinearGradient>

                        <View className="mt-8 p-6 bg-gray-50 rounded-[32px] border border-gray-100 italic">
                            <Text className="text-gray-500 text-center text-xs">
                                Information sourced from Indian Railways NTES. Actual status may vary by 15 mins.
                            </Text>
                        </View>
                    </View>
                ) : !isLoading && pnr.length === 0 ? (
                    <View className="items-center mt-20 opacity-20">
                        <Ionicons name="ticket-outline" size={120} color="#1E293B" />
                        <Text className="text-gray-400 font-bold mt-4">Safe Travels Await</Text>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}
