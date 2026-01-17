import { IFuelPriceService } from '../../../application/services/IFuelPriceService';
import logger from '../../../config/winston-config';

export class FuelPriceService implements IFuelPriceService {
  async getPrices(city: string): Promise<{ petrol: number; diesel: number }> {
    logger.info(`[FuelPriceService] Fetching fuel prices for ${city}`);
    // Mock response
    return Promise.resolve({
      petrol: 105.41,
      diesel: 96.67,
    });
  }
}
