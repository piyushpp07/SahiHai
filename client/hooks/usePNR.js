
import { useQuery } from '@tanstack/react-query';
import { getPNRStatus } from '../api/pnr';

export const usePNR = (pnrNumber) => {
  return useQuery({
    queryKey: ['pnr', pnrNumber],
    queryFn: () => getPNRStatus(pnrNumber),
    enabled: !!pnrNumber, // Only run the query if pnrNumber is provided
  });
};
