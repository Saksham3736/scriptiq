/* validators.ts — Zod validation schemas for prescription forms & API payloads */

import { z } from 'zod';

export const MedicineZodSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  strength: z.string().optional(),
  timing: z.string().optional(),
  meal_instruction: z.string().optional(),
});

export const PrescriptionZodSchema = z.object({
  patient_name: z
    .string()
    .min(2, 'Patient name must be at least 2 characters')
    .max(80, 'Patient name is too long'),
  phone: z
    .string()
    .refine(
      (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(val),
      { message: 'Invalid phone number format' }
    )
    .optional(),
  dob: z
    .string()
    .refine(
      (val) => !val || /^(\d{2}[/.-]\d{2}[/.-]\d{4}|\d{4}[/.-]\d{2}[/.-]\d{2})$/.test(val),
      { message: 'DOB must be DD/MM/YYYY or YYYY-MM-DD' }
    )
    .optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  diagnosis: z.string().min(2, 'Diagnosis is required'),
  chief_complaint: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  medicines: z.array(MedicineZodSchema).min(1, 'At least 1 medicine must be prescribed'),
  tests: z.array(z.string()).optional(),
  advice: z.array(z.string()).optional(),
  follow_up: z.string().optional(),
});

export const PharmacyOrderZodSchema = z.object({
  order_id: z.string().startsWith('PHARM-'),
  patient_name: z.string().min(1),
  phone: z.string().min(5),
  diagnosis: z.string().min(1),
  total_amount_inr: z.number().nonnegative(),
  pickup_location: z.string().min(1),
  status: z.enum(['PENDING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED']),
});

export type PrescriptionFormData = z.infer<typeof PrescriptionZodSchema>;
export type MedicineFormData = z.infer<typeof MedicineZodSchema>;
