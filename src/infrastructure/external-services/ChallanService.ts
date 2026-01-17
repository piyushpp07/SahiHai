import { IChallanService } from '../../../application/services/IChallanService';
import logger from '../../../config/winston-config';

export class ChallanService implements IChallanService {
  async getChallanDetails(vehicleNumber: string): Promise<any> {
    logger.info(`[ChallanService] Fetching challan details for ${vehicleNumber}`);
    // Mock response
    return Promise.resolve({
      vehicleNumber,
      challans: [
        { id: '123', amount: 500, reason: 'Jumping red light', date: new Date() },
        { id: '456', amount: 1000, reason: 'Overspeeding', date: new Date() },
      ],
    });
  }
}
