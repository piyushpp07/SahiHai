
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const sendMessage = async (threadId, message) => {
  const response = await axios.post(`${API_BASE_URL}/chat/${threadId}/messages`, { message });
  return response.data;
};
