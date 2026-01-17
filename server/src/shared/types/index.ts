import { z } from 'zod';

export const RegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const VehicleRCSchema = z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/);
export const PANCardSchema = z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
export const MobileSchema = z.string().regex(/^[6-9]\d{9}$/);

export type RegistrationInput = z.infer<typeof RegistrationSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
