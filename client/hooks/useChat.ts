import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const useChat = (chatId: string) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
       // Ideally fetch history. For now keeping empty or implementing fetch
       return [] as Message[];
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data } = await axios.post(`${API_URL}/chat/${chatId}/message`, { 
          text,
          provider: 'openai' // Default for now
      });
      return data as Message;
    },
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: ['chat', chatId] });

      const previousMessages = queryClient.getQueryData<Message[]>(['chat', chatId]);

      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      };

      queryClient.setQueryData<Message[]>(['chat', chatId], (old = []) => [
        ...old,
        newMessage,
      ]);

      return { previousMessages };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['chat', chatId], context?.previousMessages);
    },
    onSuccess: (data) => {
        // Add bot response
         queryClient.setQueryData<Message[]>(['chat', chatId], (old = []) => [
            ...old,
            data
          ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    },
  });

  return {
    messages,
    isLoading,
    sendMessage: sendMessageMutation.mutate,
  };
};
