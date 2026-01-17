
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getPNRStatus = async (pnrNumber) => {
  const response = await axios.get(`${API_BASE_URL}/utilities/pnr/${pnrNumber}`);
  return response.data;
};
