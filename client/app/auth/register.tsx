import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';

export default function Register() {
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !name) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            await signUp(email, password, name);
        } catch (e: any) {
             Alert.alert("Registration Failed", e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center p-8 bg-gray-50">
             <View className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <Text className="text-3xl font-bold text-center text-blue-600 mb-2">Create Account</Text>
                <Text className="text-gray-500 text-center mb-8">Join SahiHai today!</Text>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
                    <TextInput 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

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
                    onPress={handleRegister}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl items-center ${loading ? 'bg-blue-300' : 'bg-blue-600 active:bg-blue-700'}`}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign Up</Text>}
                </Pressable>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-500">Already have an account? </Text>
                    <Link href="/auth/login" asChild>
                        <Pressable><Text className="text-blue-600 font-bold">Sign In</Text></Pressable>
                    </Link>
                </View>
            </View>
        </View>
    );
}
