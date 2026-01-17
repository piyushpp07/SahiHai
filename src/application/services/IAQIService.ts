export interface IAQIService {
  getAQI(latitude: number, longitude: number): Promise<{ aqi: number; city: string }>;
}
