
import { useQuery } from '@tanstack/react-query';
import { getAQI } from '../api/aqi';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export const useAQI = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  return useQuery({
    queryKey: ['aqi', location?.coords.latitude, location?.coords.longitude],
    queryFn: () => getAQI(location.coords.latitude, location.coords.longitude),
    enabled: !!location, // Only run the query if location is available
  });
};
