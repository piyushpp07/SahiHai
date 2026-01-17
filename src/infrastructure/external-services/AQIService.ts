import { IAQIService } from '../../../application/services/IAQIService';
import logger from '../../../config/winston-config';

export class AQIService implements IAQIService {
  async getAQI(latitude: number, longitude: number): Promise<{ aqi: number; city: string }> {
    logger.info(`[AQIService] Fetching AQI for lat: ${latitude}, lon: ${longitude}`);
    // Mock response for now
    return Promise.resolve({
      aqi: 150,
      city: 'Delhi',
    });
  }
}
