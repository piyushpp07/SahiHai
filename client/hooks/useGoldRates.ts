import { useQuery } from '@tanstack/react-query';

interface GoldRates {
  gold24k: number;
  gold22k: number;
  silver: number;
  timestamp: string;
}

const fetchRates = async (): Promise<GoldRates> => {
   // Simulate API
   await new Promise(resolve => setTimeout(resolve, 800));
   
   return {
       gold24k: 72500,
       gold22k: 66400,
       silver: 88000,
       timestamp: new Date().toISOString()
   };
}

export const useGoldRates = () => {
    return useQuery({
        queryKey: ['gold-rates'],
        queryFn: fetchRates,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
