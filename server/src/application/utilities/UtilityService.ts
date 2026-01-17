import { GoldRates, Challan, PNRStatus } from '../../domain/Utility';

export class UtilityService {
    
    async getGoldRates(): Promise<GoldRates> {
        // In a real app, this would call a Finance API
        return {
            gold24k: 74550,
            gold22k: 68340,
            silver: 89400,
            timestamp: new Date().toISOString()
        };
    }

    async getChallan(vehicleNumber: string): Promise<Challan[]> {
        const normalized = vehicleNumber.toUpperCase().replace(/\s/g, '');
        // Real logic would query RTO database
        if (normalized === 'MH12AB1234' || normalized === 'DL3CAS5678') {
            return [
              { 
                id: 'CH-2025-001', 
                vehicleNumber: normalized, 
                amount: 1000, 
                violation: 'Over Speeding (65km/h in 40km/h zone)', 
                date: '2025-01-12', 
                status: 'PENDING' 
              },
              { 
                id: 'CH-2024-942', 
                vehicleNumber: normalized, 
                amount: 500, 
                violation: 'No Helmet', 
                date: '2024-12-05', 
                status: 'PAID' 
              },
            ];
        }
        return [];
    }

    async getPNRStatus(pnr: string): Promise<PNRStatus> {
        // Real logic would query NTES/Railway API
        const statuses: ('CNF' | 'WL' | 'RAC')[] = ['CNF', 'WL', 'RAC'];
        const trains = ['Rajdhani Exp', 'Shatabdi Exp', 'Duronto Exp', 'Vande Bharat'];
        
        return {
            pnr,
            trainName: trains[Math.floor(Math.random() * trains.length)],
            date: '2025-02-15',
            status: statuses[Math.floor(Math.random() * statuses.length)],
            probability: Math.floor(Math.random() * 40) + 60 // 60-100%
        };
    }

}
