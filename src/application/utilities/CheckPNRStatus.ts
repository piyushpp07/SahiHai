import { IPnrService } from '../services/IPnrService';

export class CheckPNRStatus {
  constructor(private readonly pnrService: IPnrService) {}

  async execute(pnrNumber: string): Promise<any> {
    const pnrDetails = await this.pnrService.getPnrDetails(pnrNumber);
    // Basic parsing for now, can be expanded later
    if (pnrDetails?.status === 'CONFIRMED') {
      return { status: 'Confirmed', probability: '100%' };
    } else if (pnrDetails?.status === 'WAITLISTED') {
      return { status: 'Waitlisted', probability: pnrDetails.probability || 'N/A' };
    }
    return { status: 'Unknown', probability: 'N/A' };
  }
}
