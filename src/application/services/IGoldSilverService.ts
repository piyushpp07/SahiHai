export interface IGoldSilverService {
  getLatestRates(): Promise<{ gold22k: number; gold24k: number; silver: number }>;
}
