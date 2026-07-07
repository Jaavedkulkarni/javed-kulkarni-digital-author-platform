import { z } from 'zod';
import { DELETE_REASON_OPTIONS } from './delete-recover.constants';

const deleteReasonValues = DELETE_REASON_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];

export const deleteUserFormSchema = z.object({
  reason: z.enum(deleteReasonValues, { message: 'Deletion reason is required' }),
  notes: z.string().trim().max(2000, 'Notes are too long').optional().or(z.literal('')),
  confirmed: z.literal(true, { message: 'Please confirm this soft delete' }),
});

export type DeleteUserFormValues = z.infer<typeof deleteUserFormSchema>;

export const recoverUserFormSchema = z.object({
  notes: z.string().trim().max(2000, 'Notes are too long').optional().or(z.literal('')),
});

export type RecoverUserFormValues = z.infer<typeof recoverUserFormSchema>;

export const DELETE_USER_DEFAULT_VALUES = {
  reason: 'duplicate_account' as const,
  notes: '',
};

export const RECOVER_USER_DEFAULT_VALUES: RecoverUserFormValues = {
  notes: '',
};

export type DeleteUserFormInput = Omit<DeleteUserFormValues, 'confirmed'> & {
  confirmed: boolean;
};

export const deleteUserFormInputSchema = z.object({
  reason: z.enum(deleteReasonValues, { message: 'Deletion reason is required' }),
  notes: z.string().trim().max(2000, 'Notes are too long').optional().or(z.literal('')),
  confirmed: z.boolean(),
});
