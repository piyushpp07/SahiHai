import { IAQIService } from '../services/IAQIService';

export class GetAQI {
  constructor(private readonly aqiService: IAQIService) {}

  async execute(latitude: number, longitude: number): Promise<any> {
    return this.aqiService.getAQI(latitude, longitude);
  }
}
