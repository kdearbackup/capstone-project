import z from 'zod';

export const predictSalaryValidationSchema = z.object({
  body: z.object({
    role: z.enum(['employee', 'hr', 'manager'], {
      message: 'Invalid job role.',
    }),
    jobTitle: z
      .string()
      .trim()
      .min(3, { message: 'Job title must be at least 3 characters long.' }),
    location: z
      .string()
      .trim()
      .min(3, { message: 'Location (city) name must be 3 characters long.' }),
  }),
});
