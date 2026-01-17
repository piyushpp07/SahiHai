
import { z } from 'zod';

export const vehicleChallanSchema = z.object({
  body: z.object({
    vehicleNumber: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/),
  }),
});
