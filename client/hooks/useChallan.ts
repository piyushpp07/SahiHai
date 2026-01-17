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

// Mock API Call
const fetchChallans = async (vehicleNumber: string): Promise<Challan[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response based on input
  if (vehicleNumber === 'MH12AB1234') {
    return [
      { id: 'CH1', vehicleNumber, amount: 500, violation: 'Signal Jump', date: '2025-01-10', status: 'PENDING' },
      { id: 'CH2', vehicleNumber, amount: 200, violation: 'No Parking', date: '2024-12-25', status: 'PAID' },
    ];
  }
  return [];
};

export const useChallan = (vehicleNumber: string) => {
  return useQuery({
    queryKey: ['challan', vehicleNumber],
    queryFn: () => fetchChallans(vehicleNumber),
    enabled: !!vehicleNumber && vehicleNumber.length > 4, // Simple validation check
  });
};
