import { useQuery } from '@tanstack/react-query';

interface GoldRates {
  gold24k: number;
  gold22k: number;
  silver: number;
  timestamp: string;
}

import api from '../lib/api';

const fetchRates = async (): Promise<GoldRates> => {
   const { data } = await api.get('/utilities/gold');
   return data;
}

export const useGoldRates = () => {
    return useQuery({
        queryKey: ['gold-rates'],
        queryFn: fetchRates,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

