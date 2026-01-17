import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Use a fixed threadId for demo/production persistence (per blueprint)
  const threadId = user?.id || 'guest_thread';

  // 1. Fetch History
  const { data: messages = [], isLoading: historyLoading } = useQuery({
    queryKey: ['chat-history', threadId],
    queryFn: async () => {
      const res = await api.get(`/chat/${threadId}/history`);
      return res.data;
    }
  });

  // 2. Send Message Mutation with Optimistic UI
  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.post(`/chat/${threadId}`, { text });
      return res.data;
    },
    onMutate: async (newText) => {
      // Cancel outgoing refetches (Bluepint protocol)
      await queryClient.cancelQueries({ queryKey: ['chat-history', threadId] });

      // Snapshot previous context
      const previousMessages = queryClient.getQueryData<Message[]>(['chat-history', threadId]);

      // Optimistically update
      const optimisticMsg: Message = {
        id: Date.now().toString(),
        text: newText,
        sender: 'user',
        timestamp: new Date()
      };
      
      const thinkingMsg: Message = {
        id: 'thinking',
        text: '...',
        sender: 'bot',
        timestamp: new Date()
      };

      queryClient.setQueryData(['chat-history', threadId], (old: Message[] = []) => [...old, optimisticMsg, thinkingMsg]);

      return { previousMessages };
    },
    onError: (err, newText, context) => {
        // Rollback on error (Blueprint protocol)
        if (context?.previousMessages) {
            queryClient.setQueryData(['chat-history', threadId], context.previousMessages);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['chat-history', threadId] });
    }
  });

  const handleSend = () => {
    if (inputText.trim()) {
      mutation.mutate(inputText);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`mb-4 flex-row ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <View className={`max-w-[80%] rounded-[24px] ${item.sender === 'user' ? 'bg-indigo-600 rounded-tr-none' : 'bg-gray-100 rounded-tl-none'} p-4 shadow-sm`}>
        {item.id === 'thinking' ? (
            <ActivityIndicator size="small" color="#4F46E5" />
        ) : (
            <Text className={`text-base ${item.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {item.text}
            </Text>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
        <LinearGradient
            colors={['#F9FAFB', '#FFFFFF']}
            className="flex-1"
        >
          <SafeAreaView className="flex-1" edges={['top']}>
            {/* Elite Header */}
            <View className="px-6 py-6 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="shadow-lg shadow-indigo-300">
                        <LinearGradient
                            colors={['#4F46E5', '#3730A3']}
                            className="w-12 h-12 rounded-[20px] items-center justify-center mr-4"
                        >
                            <Ionicons name="sparkles" size={24} color="white" />
                        </LinearGradient>
                    </View>
                    <View>
                        <Text className="text-gray-900 font-black text-2xl tracking-tight">SahiHai AI</Text>
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Active Engine</Text>
                        </View>
                    </View>
                </View>
                <Pressable className="bg-gray-100/50 w-11 h-11 rounded-2xl items-center justify-center border border-gray-100">
                    <Ionicons name="ellipsis-horizontal" size={20} color="#374151" />
                </Pressable>
            </View>

            {/* Chat Content */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <View className={`mb-8 flex-row ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <View className={`max-w-[85%] rounded-[32px] ${
                            item.sender === 'user' 
                            ? 'bg-indigo-600 rounded-tr-none shadow-xl shadow-indigo-100' 
                            : 'bg-white border border-gray-100 rounded-tl-none shadow-sm'
                        } p-6`}>
                            {item.id === 'thinking' ? (
                                <View className="flex-row items-center px-4 py-2">
                                    <ActivityIndicator size="small" color="#4F46E5" />
                                    <Text className="text-indigo-600 font-bold text-xs ml-3">Thinking...</Text>
                                </View>
                            ) : (
                                <Text className={`text-[17px] leading-7 ${item.sender === 'user' ? 'text-white font-bold' : 'text-gray-900 font-bold'}`}>
                                    {item.text}
                                </Text>
                            )}
                            <Text className={`text-[9px] mt-3 font-black uppercase tracking-[1px] ${item.sender === 'user' ? 'text-white/40' : 'text-gray-300'}`}>
                                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
            />

            {/* Elite Input Engine */}
            <View className="absolute bottom-6 left-6 right-6">
                <View className="shadow-2xl shadow-indigo-200">
                    <GlassCard intensity={45} className="bg-white/95 border-white/80 flex-row items-center p-2 rounded-[40px]">
                        <Pressable className="bg-gray-100 w-14 h-14 rounded-[24px] items-center justify-center ml-1">
                            <Ionicons name="add" size={26} color="#4F46E5" />
                        </Pressable>
                        <TextInput
                            className="flex-1 px-5 text-xl font-bold h-14"
                            style={{ color: '#111827', textAlignVertical: 'center' }}
                            placeholder="Ask SahiHai..."
                            placeholderTextColor="#9CA3AF"
                            selectionColor="#4F46E5"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline={false} // Changed to false for better stability unless needed
                            maxLength={500}
                        />
                        <Pressable 
                            onPress={handleSend}
                            style={({ pressed }) => [{
                                opacity: pressed ? 0.9 : 1,
                                transform: [{ scale: pressed ? 0.92 : 1 }],
                                flexShrink: 0
                            }]}
                        >
                            <LinearGradient
                                colors={['#4F46E5', '#3730A3']}
                                className="w-14 h-14 rounded-[26px] items-center justify-center shadow-lg shadow-indigo-400"
                            >
                                <Ionicons name="paper-plane" size={24} color="white" />
                            </LinearGradient>
                        </Pressable>
                    </GlassCard>
                </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

    </KeyboardAvoidingView>
  );
}
