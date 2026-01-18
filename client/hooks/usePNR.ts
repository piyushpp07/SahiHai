import { useQuery } from '@tanstack/react-query';

interface PNRStatus {
    pnr: string;
    trainName: string;
    date: string;
    status: string;
    probability?: number;
}

import api from '../lib/api';

const fetchPNR = async (pnr: string): Promise<PNRStatus> => {
    const { data } = await api.get(`/utilities/pnr/${pnr}`);
    return data;
}


export const usePNR = (pnr: string) => {
    return useQuery({
        queryKey: ['pnr', pnr],
        queryFn: () => fetchPNR(pnr),
        enabled: !!pnr && pnr.length === 10
    });
}
