import { IGoldSilverService } from '../../../application/services/IGoldSilverService';
import logger from '../../../config/winston-config';

export class GoldSilverService implements IGoldSilverService {
  async getLatestRates(): Promise<{ gold22k: number; gold24k: number; silver: number }> {
    logger.info('[GoldSilverService] Fetching latest gold and silver rates');
    // Mock response for now
    return Promise.resolve({
      gold22k: 65000,
      gold24k: 71000,
      silver: 85000,
    });
  }
}
