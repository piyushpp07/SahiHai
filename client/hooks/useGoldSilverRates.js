
import { useQuery } from '@tanstack/react-query';
import { getGoldSilverRates } from '../api/goldSilver';

export const useGoldSilverRates = () => {
  return useQuery({
    queryKey: ['goldSilverRates'],
    queryFn: getGoldSilverRates,
  });
};
