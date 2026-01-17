import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (e: any) {
            Alert.alert("Login Failed", e.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 28 }}>
                <View className="bg-white/95 p-10 rounded-[48px] shadow-2xl shadow-blue-100 border border-white/60">
                    <View className="mb-12 items-center">
                        <View className="shadow-xl shadow-blue-200">
                            <LinearGradient
                                colors={['#2563EB', '#1D4ED8']}
                                className="w-20 h-20 rounded-[28px] items-center justify-center mb-6"
                            >
                                <Ionicons name="finger-print" size={40} color="white" />
                            </LinearGradient>
                        </View>
                        <Text className="text-5xl font-black text-gray-900 mb-3 tracking-tighter">Welcome</Text>
                        <Text className="text-gray-400 font-black uppercase tracking-[2px] text-[10px]">Action Engine 2.0</Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 ml-3">Email Identity</Text>
                        <View className="bg-gray-50/80 border border-gray-100 flex-row items-center px-6 rounded-[28px]">
                            <Ionicons name="mail" size={22} color="#9CA3AF" />
                            <TextInput 
                                className="flex-1 px-5 h-16 text-xl font-bold"
                                style={{ color: '#111827', textAlignVertical: 'center' }}
                                placeholder="you@sahihai.com"
                                placeholderTextColor="#D1D5DB"
                                selectionColor="#2563eb"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none" 
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View className="mb-12">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 ml-3">Secure Key</Text>
                        <View className="bg-gray-50/80 border border-gray-100 flex-row items-center px-6 rounded-[28px]">
                            <Ionicons name="lock-closed" size={22} color="#9CA3AF" />
                            <TextInput 
                                className="flex-1 px-5 h-16 text-xl font-bold"
                                style={{ color: '#111827', textAlignVertical: 'center' }}
                                placeholder="••••••••"
                                placeholderTextColor="#D1D5DB"
                                selectionColor="#2563eb"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <Pressable 
                        onPress={handleLogin}
                        disabled={loading}
                        style={({ pressed }) => [{
                            opacity: pressed ? 0.9 : 1,
                            transform: [{ scale: pressed ? 0.96 : 1 }]
                        }]}
                    >
                        <LinearGradient
                            colors={['#2563EB', '#1D4ED8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-full py-6 rounded-[28px] items-center shadow-2xl shadow-blue-400"
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-black text-xl uppercase tracking-[1px]">Authorize</Text>
                            )}
                        </LinearGradient>
                    </Pressable>

                    <View className="mt-12 flex-row justify-center items-center">
                        <Text className="text-gray-400 font-bold">New here? </Text>
                        <Link href="/(auth)/register" asChild>
                            <Pressable className="bg-blue-50/50 px-6 py-3 rounded-full border border-blue-100/50">
                                <Text className="text-blue-600 font-black uppercase text-[10px] tracking-widest">Create Profile</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
