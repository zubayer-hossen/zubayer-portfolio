import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(10, 'Use at least 10 characters.')
      .regex(/[a-z]/, 'Add a lowercase letter.')
      .regex(/[A-Z]/, 'Add an uppercase letter.')
      .regex(/\d/, 'Add a number.'),
  })
  .refine((d) => d.currentPassword !== d.newPassword, { path: ['newPassword'], message: 'Choose a different password.' });

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  subject: z.string().trim().min(3, 'Add a short subject.').max(150),
  message: z.string().trim().min(10, 'Tell me a little more (10+ characters).').max(5000),
  budget: z.string().trim().max(60).optional().or(z.literal('')),
  projectType: z.string().trim().max(60).optional().or(z.literal('')),
  website: z.string().max(200).optional(), // honeypot
  elapsed: z.coerce.number().optional(), // time-trap: ms since the form was shown
});

export const trackSchema = z.object({
  path: z.string().max(300).default('/'),
  referrer: z.string().max(300).optional(),
});
