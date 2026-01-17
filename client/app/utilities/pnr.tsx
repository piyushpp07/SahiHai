import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { usePNR } from '../../hooks/usePNR';
import { Ionicons } from '@expo/vector-icons';

export default function PNRScreen() {
    const [pnr, setPnr] = useState('');
    const { data: status, isLoading, refetch } = usePNR(pnr);

    const handleSearch = () => {
        if (pnr.length === 10) {
            refetch();
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ title: 'PNR Status', headerShadowVisible: false }} />
            
            <View className="bg-white p-6 pb-8 rounded-b-[40px] shadow-sm">
                <Text className="text-gray-500 mb-4 font-medium">Check your Indian Railways booking status</Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl p-2">
                    <TextInput 
                        className="flex-1 p-4 text-xl font-bold text-gray-800"
                        placeholder="Enter 10-digit PNR"
                        value={pnr}
                        onChangeText={setPnr}
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                    <Pressable 
                        onPress={handleSearch}
                        className="bg-indigo-600 p-4 rounded-xl items-center justify-center"
                    >
                        <Ionicons name="train" size={24} color="white" />
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {isLoading && <ActivityIndicator size="large" color="#4f46e5" className="mt-10" />}
                
                {status ? (
                    <View className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100">
                        <View className="bg-indigo-600 p-6">
                            <Text className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Current Status</Text>
                            <Text className="text-white text-4xl font-black">{status.status}</Text>
                        </View>
                        
                        <View className="p-8">
                            <View className="flex-row justify-between mb-8">
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Train Name</Text>
                                    <Text className="text-gray-900 font-bold text-lg">{status.trainName}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Journey Date</Text>
                                    <Text className="text-gray-900 font-bold text-lg">{status.date}</Text>
                                </View>
                            </View>

                            <View className="bg-indigo-50 p-6 rounded-3xl items-center">
                                <Text className="text-indigo-600 text-xs font-bold uppercase mb-2">Confirmation Probability</Text>
                                <Text className="text-3xl font-black text-indigo-900">{status.probability}%</Text>
                                <View className="w-full bg-indigo-200 h-2 rounded-full mt-4 overflow-hidden">
                                    <View className="bg-indigo-600 h-full" style={{ width: `${status.probability || 0}%` }} />

                                </View>
                            </View>

                            <View className="mt-8 flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
                                    <Text className="text-gray-500 ml-2">PNR: {status.pnr}</Text>
                                </View>
                                <Pressable className="bg-gray-100 px-6 py-3 rounded-2xl">
                                    <Text className="text-gray-700 font-bold">Refresh</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ) : !isLoading && pnr.length === 10 ? (
                    <Text className="text-gray-400 text-center mt-10">Tap the train icon to fetch status</Text>
                ) : null}
            </ScrollView>
        </View>
    );
}
