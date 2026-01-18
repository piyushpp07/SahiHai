import { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useChallan } from '../../hooks/useChallan';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EliteInput } from '../../components/ui/EliteInput';

export default function ChallanScreen() {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const { data: challans, isLoading, refetch } = useChallan(vehicleNumber);

    const handleSearch = () => {
        if (vehicleNumber.trim()) {
            refetch();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <Stack.Screen options={{ title: 'Legal & Compliance', headerShadowVisible: false }} />
            
            <View className="px-4 pt-4 pb-12">
                <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-[2px] mb-3">Legal & Compliance</Text>
                <Text className="text-2xl font-black text-gray-900 mb-8 leading-tight">Verify{"\n"}Challans</Text>
                
                <EliteInput
                    icon="car"
                    iconColor="#ef4444"
                    placeholder="MH12AB1234"
                    value={vehicleNumber}
                    onChangeText={setVehicleNumber}
                    autoCapitalize="characters"
                    rightElement={
                        <Pressable 
                            onPress={handleSearch}
                            style={({ pressed }) => [{
                                opacity: pressed ? 0.9 : 1,
                                transform: [{ scale: pressed ? 0.94 : 1 }],
                            }]}
                        >
                            <LinearGradient
                                colors={['#ef4444', '#b91c1c']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-14 h-14 rounded-[22px] items-center justify-center shadow-lg shadow-red-400"
                            >
                                <Ionicons name="chevron-forward" size={24} color="white" />
                            </LinearGradient>
                        </Pressable>
                    }
                />
            </View>

            <ScrollView className="flex-1 px-4">
                {isLoading && <ActivityIndicator size="large" color="#ef4444" className="mt-10" />}
                
                {challans && challans.length > 0 ? (
                    challans.map((challan: any) => (
                        <View key={challan.id} className="mb-6">
                            <LinearGradient
                                colors={['#FFFFFF', '#F9FAFB']}
                                className="rounded-[32px] p-6 border border-gray-100 shadow-sm"
                            >
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="bg-red-100 px-4 py-1.5 rounded-full">
                                        <Text className="text-red-600 font-bold text-[10px] uppercase tracking-widest">{challan.status}</Text>
                                    </View>
                                    <Text className="text-gray-300 font-bold text-[10px]">{challan.id}</Text>
                                </View>
                                
                                <Text className="text-xl font-black text-gray-900">₹{challan.amount}</Text>
                                <Text className="text-gray-600 font-medium mb-6 mt-1">{challan.violation}</Text>
                                
                                <View className="flex-row justify-between items-center pt-6 border-t border-gray-50">
                                    <View className="flex-row items-center">
                                        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                                        <Text className="text-gray-400 text-xs ml-2 font-bold">{challan.date}</Text>
                                    </View>
                                    <Pressable className="bg-black px-6 py-2.5 rounded-full">
                                        <Text className="text-white font-bold text-xs">Pay Now</Text>
                                    </Pressable>
                                </View>
                            </LinearGradient>
                        </View>
                    ))
                ) : !isLoading && vehicleNumber.length > 5 ? (
                    <View className="items-center mt-20">
                        <View className="bg-emerald-100 w-24 h-24 rounded-full items-center justify-center mb-6">
                            <Ionicons name="shield-checkmark" size={48} color="#10B981" />
                        </View>
                        <Text className="text-2xl font-black text-gray-900">No Fines Found</Text>
                        <Text className="text-gray-400 font-bold mt-2">Drive safe!</Text>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}
