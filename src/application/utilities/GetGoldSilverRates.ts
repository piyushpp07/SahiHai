import { IGoldSilverService } from '../services/IGoldSilverService';

export class GetGoldSilverRates {
  constructor(private readonly goldSilverService: IGoldSilverService) {}

  async execute(): Promise<any> {
    return this.goldSilverService.getLatestRates();
  }
}
