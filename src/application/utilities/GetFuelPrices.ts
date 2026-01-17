
import { IFuelPriceService } from '../services/IFuelPriceService';

export class GetFuelPrices {
  constructor(private readonly fuelPriceService: IFuelPriceService) {}

  async execute(city: string): Promise<{ petrol: number; diesel: number }> {
    return this.fuelPriceService.getPrices(city);
  }
}
