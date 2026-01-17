
import { Request, Response } from 'express';
import { CheckChallan } from '../../../../application/utilities/CheckChallan';
import { GetFuelPrices } from '../../../../application/utilities/GetFuelPrices';
import { CheckPNRStatus } from '../../../../application/utilities/CheckPNRStatus';
import { GetGoldSilverRates } from '../../../../application/utilities/GetGoldSilverRates';
import { GetAQI } from '../../../../application/utilities/GetAQI';

export class UtilitiesController {
  constructor(
    private readonly checkChallan: CheckChallan,
    private readonly getFuelPrices: GetFuelPrices,
    private readonly checkPNRStatus: CheckPNRStatus,
    private readonly getGoldSilverRates: GetGoldSilverRates,
    private readonly getAQI: GetAQI,
  ) {}

  async checkChallan(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleNumber } = req.params;
      const challanDetails = await this.checkChallan.execute(vehicleNumber);
      res.json(challanDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFuelPrices(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.query;
      const prices = await this.getFuelPrices.execute(city as string);
      res.json(prices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async checkPNRStatus(req: Request, res: Response): Promise<void> {
    try {
      const { pnrNumber } = req.params;
      const pnrDetails = await this.checkPNRStatus.execute(pnrNumber);
      res.json(pnrDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getGoldSilverRates(req: Request, res: Response): Promise<void> {
    try {
      const rates = await this.getGoldSilverRates.execute();
      res.json(rates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAQI(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude } = req.query;
      const aqi = await this.getAQI.execute(parseFloat(latitude as string), parseFloat(longitude as string));
      res.json(aqi);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

