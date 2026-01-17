
import { IChallanService } from '../services/IChallanService';

export class CheckChallan {
  constructor(private readonly challanService: IChallanService) {}

  async execute(vehicleNumber: string): Promise<any> {
    return this.challanService.getChallanDetails(vehicleNumber);
  }
}
