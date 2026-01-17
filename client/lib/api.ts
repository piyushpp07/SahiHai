import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
