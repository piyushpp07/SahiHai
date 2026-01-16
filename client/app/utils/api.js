import axios from "axios";

// Use environment variable for API URL
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.39:5051";

console.log("🔗 API Base URL:", API_BASE_URL); // Log for debugging

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
