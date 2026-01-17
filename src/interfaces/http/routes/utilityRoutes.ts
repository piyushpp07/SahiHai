import { Router } from 'express';
import { UtilitiesController } from '../controllers/UtilitiesController';
import { validate } from '../middleware/validationMiddleware';
import { checkChallanSchema, getFuelPricesSchema, checkPNRStatusSchema, getGoldSilverRatesSchema, getAQISchema } from '../schemas/utilitySchemas';

export const createUtilityRoutes = (utilitiesController: UtilitiesController): Router => {
  const router = Router();
  router.get('/challan/:vehicleNumber', validate(checkChallanSchema), (req, res) => utilitiesController.checkChallan(req, res));
  router.get('/fuel', validate(getFuelPricesSchema), (req, res) => utilitiesController.getFuelPrices(req, res));
  router.get('/pnr/:pnrNumber', validate(checkPNRStatusSchema), (req, res) => utilitiesController.checkPNRStatus(req, res));
  router.get('/gold-silver', validate(getGoldSilverRatesSchema), (req, res) => utilitiesController.getGoldSilverRates(req, res));
  router.get('/aqi', validate(getAQISchema), (req, res) => utilitiesController.getAQI(req, res));
  return router;
};
