
import { useQuery } from '@tanstack/react-query';
import { getChallanDetails } from '../api/challan';

export const useChallan = (vehicleNumber) => {
  return useQuery({
    queryKey: ['challan', vehicleNumber],
    queryFn: () => getChallanDetails(vehicleNumber),
    enabled: !!vehicleNumber, // Only run the query if vehicleNumber is provided
  });
};
