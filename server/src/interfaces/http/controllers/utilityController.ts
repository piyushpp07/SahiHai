import { Request, Response } from 'express';
import { UtilityService } from '../../../application/utilities/UtilityService';

const service = new UtilityService();

export const getGoldRates = async (req: Request, res: Response) => {
    try {
        const rates = await service.getGoldRates();
        res.json(rates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gold rates' });
    }
};

export const getChallan = async (req: Request, res: Response) => {
    try {
        const { vehicleNumber } = req.params;
        const challans = await service.getChallan(vehicleNumber);
        res.json(challans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch challan' });
    }
};

export const getPNR = async (req: Request, res: Response) => {
    try {
        const { pnr } = req.params;
        const status = await service.getPNRStatus(pnr);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PNR status' });
    }
};
