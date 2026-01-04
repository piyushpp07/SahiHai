import axios from "axios";

// Use environment variable for production, fallback to local IP for development
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.34:5051"; // Local development IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
