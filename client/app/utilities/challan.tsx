import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useChallan } from '../../hooks/useChallan';
import { Ionicons } from '@expo/vector-icons';

export default function ChallanScreen() {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const { data: challans, isLoading, refetch, error } = useChallan(vehicleNumber);

    const handleSearch = () => {
        if (vehicleNumber.trim()) {
            refetch();
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ title: 'Traffic Challans', headerShadowVisible: false }} />
            
            <View className="bg-white p-6 pb-8 rounded-b-[40px] shadow-sm">
                <Text className="text-gray-500 mb-4 font-medium">Verify your vehicle's pending fines</Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl p-2">
                    <TextInput 
                        className="flex-1 p-4 text-lg font-bold text-gray-800"
                        placeholder="e.g. MH12AB1234"
                        value={vehicleNumber}
                        onChangeText={setVehicleNumber}
                        autoCapitalize="characters"
                    />
                    <Pressable 
                        onPress={handleSearch}
                        className="bg-blue-600 p-4 rounded-xl items-center justify-center"
                    >
                        <Ionicons name="search" size={24} color="white" />
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {isLoading && <ActivityIndicator size="large" color="#2563eb" className="mt-10" />}
                
                {challans && challans.length > 0 ? (
                    challans.map((challan) => (
                        <View key={challan.id} className="bg-white p-6 rounded-3xl mb-4 shadow-sm border border-gray-100">
                            <View className="flex-row justify-between items-start mb-4">
                                <View>
                                    <Text className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Challan ID</Text>
                                    <Text className="text-gray-800 font-bold">{challan.id}</Text>
                                </View>
                                <View className={`px-4 py-1.5 rounded-full ${challan.status === 'PAID' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <Text className={`text-xs font-bold ${challan.status === 'PAID' ? 'text-green-700' : 'text-red-700'}`}>
                                        {challan.status}
                                    </Text>
                                </View>
                            </View>
                            
                            <Text className="text-xl font-bold text-gray-900 mb-2">₹{challan.amount}</Text>
                            <Text className="text-gray-600 mb-4">{challan.violation}</Text>
                            
                            <View className="pt-4 border-t border-gray-50 flex-row justify-between">
                                <Text className="text-gray-400 text-sm">{challan.date}</Text>
                                <Pressable>
                                    <Text className="text-blue-600 font-bold">View Details</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))
                ) : !isLoading && vehicleNumber.length > 5 ? (
                    <View className="items-center mt-20">
                        <Ionicons name="checkmark-circle-outline" size={80} color="#10b981" />
                        <Text className="text-xl font-bold text-gray-800 mt-4">Safe & Sound!</Text>
                        <Text className="text-gray-500 text-center mt-2 px-10">
                            No pending challans found for {vehicleNumber.toUpperCase()}
                        </Text>
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
}
