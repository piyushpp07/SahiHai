import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EliteInput } from '../../components/ui/EliteInput';

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
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
                <View className="bg-white/95 p-6 rounded-[48px] shadow-2xl shadow-blue-100 border border-white/60">
                    <View className="mb-12 items-center">
                        <View className="shadow-xl shadow-blue-200">
                            <LinearGradient
                                colors={['#2563EB', '#1D4ED8']}
                                className="w-16 h-16 rounded-[22px] items-center justify-center mb-6"
                            >
                                <Ionicons name="finger-print" size={32} color="white" />
                            </LinearGradient>
                        </View>
                        <Text className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">Welcome</Text>
                        <Text className="text-gray-400 font-black uppercase tracking-[2px] text-[10px]">Action Engine 2.0</Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 ml-3">Email Identity</Text>
                        <EliteInput
                            icon="mail"
                            iconColor="#2563EB"
                            placeholder="you@sahihai.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="mb-12">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 ml-3">Secure Key</Text>
                        <EliteInput
                            icon="lock-closed"
                            iconColor="#2563EB"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
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
                            className="w-full py-4 rounded-[22px] items-center shadow-2xl shadow-blue-400"
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
