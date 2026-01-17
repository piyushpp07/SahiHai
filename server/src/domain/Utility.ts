export interface GoldRates {
    gold24k: number;
    gold22k: number;
    silver: number;
    timestamp: string;
}

export interface Challan {
    id: string;
    vehicleNumber: string;
    amount: number;
    violation: string;
    date: string;
    status: 'PENDING' | 'PAID';
}

export interface PNRStatus {
    pnr: string;
    trainName: string;
    date: string;
    status: 'CNF' | 'WL' | 'RAC';
    probability?: number;
}
