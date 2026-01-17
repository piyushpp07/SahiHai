import { useQuery } from '@tanstack/react-query';

// Mock Data Types
interface Challan {
  id: string;
  vehicleNumber: string;
  amount: number;
  violation: string;
  date: string;
  status: 'PENDING' | 'PAID';
}

import api from '../lib/api';

// Mock API Call
const fetchChallans = async (vehicleNumber: string): Promise<Challan[]> => {
  const { data } = await api.get(`/utilities/challan/${vehicleNumber}`);
  return data;
};


export const useChallan = (vehicleNumber: string) => {
  return useQuery({
    queryKey: ['challan', vehicleNumber],
    queryFn: () => fetchChallans(vehicleNumber),
    enabled: !!vehicleNumber && vehicleNumber.length > 4, // Simple validation check
  });
};
