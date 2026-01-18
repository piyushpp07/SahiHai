import React, { useState, useRef } from 'react';
import { View, Text, Pressable, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EliteInput } from '../../components/ui/EliteInput';

import * as ImagePicker from 'expo-image-picker';
import { Image as ExpoImage } from 'expo-image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

export default function ChatScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  
  const threadId = user?.id || 'guest_thread';

  const { data: messages = [], isLoading: historyLoading } = useQuery({
    queryKey: ['chat-history', threadId],
    queryFn: async () => {
      const res = await api.get(`/chat/${threadId}/history`);
      return res.data;
    }
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ text, image }: { text: string; image?: string | null }) => {
      const res = await api.post(`/chat/${threadId}`, { text, image });
      return res.data;
    },
    onMutate: async ({ text, image }) => {
      await queryClient.cancelQueries({ queryKey: ['chat-history', threadId] });
      const previousMessages = queryClient.getQueryData<Message[]>(['chat-history', threadId]);
      
      const optimisticMsg: Message = {
        id: Date.now().toString(),
        text: text,
        sender: 'user',
        timestamp: new Date(),
        image: image || undefined
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
    onError: (err, variables, context) => {
        if (context?.previousMessages) {
            queryClient.setQueryData(['chat-history', threadId], context.previousMessages);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['chat-history', threadId] });
    }
  });

  const handleSend = () => {
    if (inputText.trim() || selectedImage) {
      mutation.mutate({ text: inputText, image: selectedImage });
      setInputText('');
      setSelectedImage(null);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
        <LinearGradient colors={['#F9FAFB', '#FFFFFF']} className="flex-1">
          <SafeAreaView className="flex-1" edges={['top']}>
            <View className="px-4 py-6 flex-row items-center justify-between border-b border-gray-100">
                <View className="flex-row items-center">
                    <View className="shadow-lg shadow-indigo-300">
                        <LinearGradient colors={['#4F46E5', '#3730A3']} className="w-10 h-10 rounded-[16px] items-center justify-center mr-4">
                            <Ionicons name="sparkles" size={20} color="white" />
                        </LinearGradient>
                    </View>
                    <View>
                        <Text className="text-gray-900 font-black text-xl tracking-tight">SahiHai AI</Text>
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

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <View className={`mb-8 flex-row ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <View className={`max-w-[85%] rounded-[28px] ${
                            item.sender === 'user' 
                            ? 'bg-indigo-600 rounded-tr-none shadow-xl shadow-indigo-100' 
                            : 'bg-white border border-gray-100 rounded-tl-none shadow-sm'
                        } p-5`}>
                            {item.image && (
                                <ExpoImage
                                    source={{ uri: item.image }}
                                    style={{ width: 240, height: 180, borderRadius: 16, marginBottom: 12 }}
                                    contentFit="cover"
                                />
                            )}
                            {item.id === 'thinking' ? (
                                <View className="flex-row items-center py-1">
                                    <ActivityIndicator size="small" color="#4F46E5" />
                                    <Text className="text-indigo-600 font-bold text-xs ml-3">Thinking...</Text>
                                </View>
                            ) : (
                                <Text className={`text-[15px] leading-6 ${item.sender === 'user' ? 'text-white font-bold' : 'text-gray-900 font-bold'}`}>
                                    {item.text}
                                </Text>
                            )}
                            <Text className={`text-[9px] mt-3 font-black uppercase tracking-[1px] ${item.sender === 'user' ? 'text-white/40' : 'text-gray-300'}`}>
                                {item.timestamp instanceof Date ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
            />

            <View className="absolute bottom-6 left-4 right-4">
                {selectedImage && (
                    <View className="mb-4 flex-row">
                        <View className="relative">
                            <ExpoImage 
                                source={{ uri: selectedImage }} 
                                style={{ width: 80, height: 80, borderRadius: 16 }}
                            />
                            <Pressable 
                                onPress={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center border-2 border-white"
                            >
                                <Ionicons name="close" size={14} color="white" />
                            </Pressable>
                        </View>
                    </View>
                )}
                <EliteInput
                    placeholder="Ask SahiHai..."
                    value={inputText}
                    onChangeText={setInputText}
                    maxLength={500}
                    icon="add"
                    iconColor="#4F46E5"
                    onIconPress={pickImage}
                    rightElement={
                        <Pressable 
                            onPress={handleSend}
                            disabled={mutation.isPending}
                            style={({ pressed }) => [{
                                opacity: (pressed || mutation.isPending) ? 0.7 : 1,
                                transform: [{ scale: pressed ? 0.92 : 1 }],
                            }]}
                        >
                            <LinearGradient
                                colors={['#4F46E5', '#3730A3']}
                                className="w-12 h-12 rounded-[20px] items-center justify-center shadow-lg shadow-indigo-400"
                            >
                                {mutation.isPending ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Ionicons name="paper-plane" size={20} color="white" />
                                )}
                            </LinearGradient>
                        </Pressable>
                    }
                />
            </View>
          </SafeAreaView>
        </LinearGradient>
    </KeyboardAvoidingView>
  );
}
