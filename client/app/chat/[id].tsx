import { View, TextInput, FlatList, KeyboardAvoidingView, Platform, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChat } from '../../hooks/useChat';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Default to 'new' if id is missing/undefined, though router usually handles this.
  const chatId = id || 'new'; 
  const { messages, sendMessage, isLoading } = useChat(chatId);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          className="px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              className={`my-2 p-3 rounded-2xl max-w-[80%] ${
                item.sender === 'user'
                  ? 'bg-blue-500 self-end rounded-tr-none'
                  : 'bg-gray-200 self-start rounded-tl-none'
              }`}
            >
              <Text
                className={`${
                  item.sender === 'user' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {item.text}
              </Text>
            </View>
          )}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="border-t border-gray-200 p-4 bg-white"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="flex-row items-center gap-2">
            <TextInput
            className="flex-1 bg-gray-100 p-3 rounded-full text-base"
            placeholder="Ask SahiHai anything..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            />
            <Pressable 
                onPress={handleSend}
                className={`p-3 rounded-full ${input.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
                disabled={!input.trim()}
            >
             <Feather name="send" size={24} color="white" />
            </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
