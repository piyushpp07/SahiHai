import { Router } from 'express';
import { getChallan, getGoldRates, getPNR } from '../controllers/utilityController';

const router = Router();

router.get('/gold', getGoldRates);
router.get('/challan/:vehicleNumber', getChallan);
router.get('/pnr/:pnr', getPNR);

export default router;
