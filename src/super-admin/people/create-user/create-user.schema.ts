import { z } from 'zod';
import { PASSWORD_MIN_LENGTH, PASSWORD_SPECIAL_CHARS } from './create-user.constants';

const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .refine((value) => /[A-Z]/.test(value), 'Password must include an uppercase letter')
  .refine((value) => /[a-z]/.test(value), 'Password must include a lowercase letter')
  .refine((value) => /[0-9]/.test(value), 'Password must include a number')
  .refine(
    (value) => new RegExp(`[${escapeRegex(PASSWORD_SPECIAL_CHARS)}]`).test(value),
    'Password must include a special character',
  );

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const createUserFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name is too long'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long'),
  displayName: z.string().trim().max(120, 'Display name is too long').optional().or(z.literal('')),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || phonePattern.test(value), 'Enter a valid phone number'),
  profilePhoto: z.instanceof(File).nullable().optional(),
  role: z.string().trim().min(1, 'Role is required'),
  status: z.enum(['active', 'pending', 'suspended']),
  emailVerificationRequired: z.boolean(),
  password: passwordSchema,
  language: z.string().trim().min(1, 'Language is required'),
  timezone: z.string().trim().min(1, 'Timezone is required'),
  internalNotes: z.string().trim().max(2000, 'Notes are too long').optional().or(z.literal('')),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export function evaluatePasswordChecks(password: string) {
  return {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: new RegExp(`[${escapeRegex(PASSWORD_SPECIAL_CHARS)}]`).test(password),
  };
}

export function computePasswordStrength(password: string) {
  const checks = evaluatePasswordChecks(password);
  const score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) return { level: 'weak' as const, score, label: 'Weak', checks };
  if (score === 3) return { level: 'fair' as const, score, label: 'Fair', checks };
  if (score === 4) return { level: 'good' as const, score, label: 'Good', checks };
  return { level: 'strong' as const, score, label: 'Strong', checks };
}

export function generateSecurePassword(length = 16): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const special = PASSWORD_SPECIAL_CHARS;
  const all = upper + lower + numbers + special;

  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  const required = [pick(upper), pick(lower), pick(numbers), pick(special)];
  const remaining = Array.from({ length: Math.max(length - required.length, 0) }, () => pick(all));

  const combined = [...required, ...remaining];
  for (let i = combined.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}
