
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getAQI = async (latitude, longitude) => {
  const response = await axios.get(`${API_BASE_URL}/utilities/aqi`, {
    params: { latitude, longitude }
  });
  return response.data;
};
