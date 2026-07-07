import { z } from 'zod';
import { SUSPEND_REASON_OPTIONS } from './suspend-restore.constants';

const suspendReasonValues = SUSPEND_REASON_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];

export const suspendUserFormSchema = z.object({
  reason: z.enum(suspendReasonValues, { message: 'Suspension reason is required' }),
  notes: z.string().trim().max(2000, 'Notes are too long').optional().or(z.literal('')),
  effectiveImmediately: z.boolean(),
});

export type SuspendUserFormValues = z.infer<typeof suspendUserFormSchema>;

export const restoreUserFormSchema = z.object({
  notes: z.string().trim().max(2000, 'Notes are too long').optional().or(z.literal('')),
});

export type RestoreUserFormValues = z.infer<typeof restoreUserFormSchema>;

export const SUSPEND_USER_DEFAULT_VALUES: SuspendUserFormValues = {
  reason: 'policy_violation',
  notes: '',
  effectiveImmediately: true,
};

export const RESTORE_USER_DEFAULT_VALUES: RestoreUserFormValues = {
  notes: '',
};
