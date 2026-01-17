import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { usePNR } from '../../hooks/usePNR';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

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
            
            <View className="px-6 pt-4 pb-12">
                <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-[2px] mb-3">Railways Intelligence</Text>
                <Text className="text-4xl font-black text-gray-900 mb-8 leading-tight">Check PNR{"\n"}Status</Text>
                
                <View className="shadow-2xl shadow-blue-200">
                    <GlassCard intensity={45} className="bg-white/95 border-white/80 flex-row items-center p-2 rounded-[36px]">
                        <View className="pl-6 mr-4">
                            <Ionicons name="ticket" size={24} color="#2563eb" />
                        </View>
                        <TextInput 
                            className="flex-1 text-2xl font-black h-16"
                            style={{ color: '#111827', textAlignVertical: 'center' }}
                            placeholder="10-digit PNR"
                            placeholderTextColor="#9CA3AF"
                            selectionColor="#2563eb"
                            value={pnr}
                            onChangeText={setPnr}
                            keyboardType="number-pad"
                            maxLength={10}
                        />
                        <Pressable 
                            onPress={handleSearch}
                            style={({ pressed }) => [{
                                opacity: pressed ? 0.9 : 1,
                                transform: [{ scale: pressed ? 0.94 : 1 }],
                                flexShrink: 0
                            }]}
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#1E4ED8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-16 h-16 rounded-[28px] items-center justify-center shadow-lg shadow-blue-400"
                            >
                                <Ionicons name="chevron-forward" size={30} color="white" />
                            </LinearGradient>
                        </Pressable>
                    </GlassCard>
                </View>
            </View>

            <ScrollView className="flex-1 px-6">
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
                                    <Text className="text-white text-5xl font-black">{status.status}</Text>
                                </View>
                                <Ionicons name="train" size={40} color="white" />
                            </View>

                            <View className="flex-row justify-between mb-8">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase mb-1">Train</Text>
                                    <Text className="text-white font-bold text-lg" numberOfLines={1}>{status.trainName}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase mb-1">Date</Text>
                                    <Text className="text-white font-bold text-lg">{status.date}</Text>
                                </View>
                            </View>

                            <View className="bg-white/10 p-6 rounded-[32px] items-center border border-white/10">
                                <Text className="text-blue-300 text-[10px] font-bold uppercase mb-2">Confirmation Probability</Text>
                                <View className="flex-row items-baseline">
                                    <Text className="text-5xl font-black text-white">{status.probability}</Text>
                                    <Text className="text-xl font-bold text-blue-400 ml-1">%</Text>
                                </View>
                                <View className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
                                    <View className="bg-blue-500 h-full" style={{ width: `${status.probability}%` as any }} />
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
