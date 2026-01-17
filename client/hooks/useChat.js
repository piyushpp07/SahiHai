
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../api/chat'; // Assuming you have an API function to send a message

export const useChat = (threadId) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (message) => sendMessage(threadId, message),
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chat', threadId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['chat', threadId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['chat', threadId], (old) => ({
        ...old,
        messages: [...old.messages, { role: 'user', content: newMessage, timestamp: new Date() }],
      }));

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // Rollback to the previous value
      queryClient.setQueryData(['chat', threadId], context?.previousMessages);
      // TODO: Show a "Retry" toast
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['chat', threadId] });
    },
  });

  return mutation;
};
