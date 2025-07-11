import z from 'zod';

const nameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'First name must be at least 3 characters long' }),
  lastName: z
    .string()
    .trim()
    .min(3, { message: 'Lat name must be at least 3 characters long' }),
});

export const WorkLocationSchema = z.object({
  city: z.string().trim().min(3, {
    message: 'The name of the city must be at least 3 characters long',
  }),

  state: z.string().trim().min(2, {
    message: 'The name of the state must be at least 2 characters long',
  }),

  country: z.string().trim().min(2, {
    message: 'The name of the country must be at least 2 characters long',
  }),
});

const createUserValidationSchema = z.object({
  body: z.object({
    name: nameValidationSchema.required(),
    email: z.email().trim(),
    phoneNo: z
      .string()
      .trim()
      .refine((data) => /^\d{10}$/.test(data), {
        message:
          'Phone number can contain only numeric characters and must be 10 characters long',
      }),
    role: z.enum(['employee', 'hr', 'manager']).optional(),
    password: z
      .string()
      .trim()
      .refine((data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/.test(data), {
        message:
          'Password must be at least 5 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number',
      }),
    workLocation: WorkLocationSchema.required(),
    salary: z
      .number()
      .positive({ message: 'Salary must be a positive number' }),
    jobTitle: z
      .string()
      .trim()
      .min(3, { message: 'Job title must be at least 3 characters long' }),
    managerId: z.string().optional(),
  }),
});

const UpdateEmployeeDetailValidationSchema = z.object({
  body: z.object({
    name: nameValidationSchema.partial().optional(),
    phoneNo: z
      .string()
      .trim()
      .refine((val) => /^\d{10}$/.test(val), {
        message:
          'Phone number must be 10 digits and contain only numeric characters',
      })
      .optional(),
    workLocation: WorkLocationSchema.partial().optional(),
  }),
});

const UpdateHRManagerDetailValidationSchema = z.object({
  body: z.object({
    role: z.enum(['employee', 'manager', 'hr']).optional(),
    salary: z
      .number()
      .positive({ message: 'Salary must be a positive number' })
      .optional(),
    jobTitle: z
      .string()
      .trim()
      .min(3, { message: 'Job title must be at least 3 characters long' })
      .optional(),
    managerId: z.string().optional(),
  }),
});

export const userDetailsValidationSchema = {
  createUserValidationSchema,
  UpdateEmployeeDetailValidationSchema,
  UpdateHRManagerDetailValidationSchema,
};
