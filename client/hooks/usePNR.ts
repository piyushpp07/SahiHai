import { useQuery } from '@tanstack/react-query';

interface PNRStatus {
    pnr: string;
    trainName: string;
    date: string;
    status: 'CNF' | 'WL' | 'RAC';
    probability?: number;
}

const fetchPNR = async (pnr: string): Promise<PNRStatus> => {
    // Mock
    await new Promise(r => setTimeout(r, 1000));
    return {
        pnr,
        trainName: 'Rajdhani Express',
        date: '2025-02-20',
        status: 'WL',
        probability: 85
    }
}

export const usePNR = (pnr: string) => {
    return useQuery({
        queryKey: ['pnr', pnr],
        queryFn: () => fetchPNR(pnr),
        enabled: !!pnr && pnr.length === 10
    });
}
