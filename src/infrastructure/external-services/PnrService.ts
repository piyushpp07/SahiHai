import { IPnrService } from '../../../application/services/IPnrService';
import logger from '../../../config/winston-config';

export class PnrService implements IPnrService {
  async getPnrDetails(pnrNumber: string): Promise<any> {
    logger.info(`[PnrService] Fetching PNR details for ${pnrNumber}`);
    // Mock response for now
    if (pnrNumber.startsWith('123')) {
      return Promise.resolve({ status: 'CONFIRMED', pnrNumber });
    } else if (pnrNumber.startsWith('456')) {
      return Promise.resolve({ status: 'WAITLISTED', pnrNumber, probability: '70%' });
    }
    return Promise.resolve({ status: 'UNKNOWN', pnrNumber });
  }
}
