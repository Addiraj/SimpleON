import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(64, 'Display name cannot exceed 64 characters')
    .optional()
    .or(z.literal('')),
  display_name: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(64, 'Display name cannot exceed 64 characters')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
});

export const updatePreferencesSchema = z.object({
  language: z.string().trim().min(2, 'Language code must be at least 2 characters').max(32).optional(),
  theme: z.enum(['dark', 'light', 'system', 'DARK', 'LIGHT', 'SYSTEM']).optional(),
  emailNotifications: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
  in_app_notifications: z.boolean().optional(),
});
