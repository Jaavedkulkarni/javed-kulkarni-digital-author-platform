import { z } from 'zod';

const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;

export const editUserFieldSchemas = {
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name is too long'),
  lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Last name is too long'),
  displayName: z.string().trim().max(120, 'Display name is too long'),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || phonePattern.test(value), 'Enter a valid phone number'),
  status: z.enum(['active', 'pending', 'suspended']),
  language: z.string().trim().min(1, 'Language is required'),
  timezone: z.string().trim().min(1, 'Timezone is required'),
  internalNotes: z.string().trim().max(2000, 'Notes are too long'),
  primaryRoleSlug: z.string().trim().min(1, 'Primary role is required'),
  activeRoles: z.array(z.string().trim().min(1)).min(1, 'At least one role is required'),
} as const;

export const editUserFormSchema = z.object({
  firstName: editUserFieldSchemas.firstName,
  lastName: editUserFieldSchemas.lastName,
  displayName: editUserFieldSchemas.displayName,
  phone: editUserFieldSchemas.phone,
  status: editUserFieldSchemas.status,
  language: editUserFieldSchemas.language,
  timezone: editUserFieldSchemas.timezone,
  internalNotes: editUserFieldSchemas.internalNotes,
  primaryRoleSlug: editUserFieldSchemas.primaryRoleSlug,
  activeRoles: editUserFieldSchemas.activeRoles,
  avatarFile: z.instanceof(File).nullable(),
  removeAvatar: z.boolean(),
});

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;

export function validateChangedEditUserFields(
  changedKeys: (keyof EditUserFormValues)[],
  values: EditUserFormValues,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const key of changedKeys) {
    if (key === 'avatarFile' || key === 'removeAvatar') continue;
    const schema = editUserFieldSchemas[key as keyof typeof editUserFieldSchemas];
    if (!schema) continue;
    const result = schema.safeParse(values[key as keyof EditUserFormValues]);
    if (!result.success) {
      errors[key] = result.error.issues[0]?.message ?? 'Invalid value';
    }
  }

  return errors;
}
