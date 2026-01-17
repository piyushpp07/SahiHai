export interface IFuelPriceService {
  getPrices(city: string): Promise<{ petrol: number; diesel: number }>;
}
