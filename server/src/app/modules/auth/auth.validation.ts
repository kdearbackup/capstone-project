import { z } from 'zod';

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .email({
        message: 'Email field is require. Must provide a valid email',
      })
      .trim(),
    password: z
      .string()
      .trim()
      .refine((data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/.test(data), {
        message:
          'Password must be at least 5 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number',
      }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().trim().min(5, {
      message:
        'Old password is required and must be at least 5 characters long.',
    }),
    newPassword: z
      .string()
      .trim()
      .refine((data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/.test(data), {
        message:
          'New passworld is Required. Password must be at least 5 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number',
      }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string(),
  }),
});

export const authValidations = {
  loginUserValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
