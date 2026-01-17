import { z } from 'zod';

export const checkChallanSchema = z.object({
  params: z.object({
    vehicleNumber: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, 'Invalid vehicle registration number format'),
  }),
});

export const getFuelPricesSchema = z.object({
  query: z.object({
    city: z.string().min(1),
  }),
});

export const checkPNRStatusSchema = z.object({
  params: z.object({
    pnrNumber: z.string().length(10, 'PNR number must be 10 digits.'), // PNR numbers are typically 10 digits
  }),
});

export const getGoldSilverRatesSchema = z.object({
  // No params or query for this endpoint, as it fetches latest rates
});

export const getAQISchema = z.object({
  query: z.object({
    latitude: z.string().regex(/^-?\d*\.?\d+$/, 'Latitude must be a valid number').transform(Number),
    longitude: z.string().regex(/^-?\d*\.?\d+$/, 'Longitude must be a valid number').transform(Number),
  }),
});



