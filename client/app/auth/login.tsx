import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';

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
        <View className="flex-1 justify-center p-8 bg-gray-50">
            <View className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <Text className="text-3xl font-bold text-center text-blue-600 mb-2">Welcome Back</Text>
                <Text className="text-gray-500 text-center mb-8">Sign in to your everyday assistant</Text>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
                    <TextInput 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none" 
                        keyboardType="email-address"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                    <TextInput 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <Pressable 
                    onPress={handleLogin}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl items-center ${loading ? 'bg-blue-300' : 'bg-blue-600 active:bg-blue-700'}`}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
                </Pressable>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-500">Don't have an account? </Text>
                    <Link href="/auth/register" asChild>
                        <Pressable><Text className="text-blue-600 font-bold">Sign Up</Text></Pressable>
                    </Link>
                </View>
            </View>
        </View>
    );
}
