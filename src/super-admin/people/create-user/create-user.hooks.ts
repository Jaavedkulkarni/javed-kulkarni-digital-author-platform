import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../../context/ToastContext';
import { mapEdgeFunctionInvokeError } from '../../../lib/edge-functions';
import { useInvalidatePeople } from '../hooks';
import { CREATE_USER_DEFAULT_VALUES, CREATE_USER_UNSAVED_MESSAGE } from './create-user.constants';
import { createUserFormSchema, type CreateUserFormValues } from './create-user.schema';
import { getCreateUserService } from './create-user.service';
import { isEdgeFunctionFailure } from '../../../lib/edge-functions/types';

export function useCreateUserDrawer() {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  return { open, openDrawer, closeDrawer, setOpen };
}

export function useCreateUserForm() {
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: CREATE_USER_DEFAULT_VALUES,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return form;
}

export function useCreateUserSubmit(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { invalidateEverything } = useInvalidatePeople();
  const service = useMemo(() => getCreateUserService(), []);

  const submit = useCallback(
    async (values: CreateUserFormValues) => {
      setIsSubmitting(true);
      try {
        const result = await service.createUser(values);

        if (isEdgeFunctionFailure(result)) {
          showToast(result.error.message);
          return;
        }

        showToast('User created successfully');
        await invalidateEverything();
        onSuccess?.();
      } catch (error) {
        const message = await mapEdgeFunctionInvokeError(error);
        showToast(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [invalidateEverything, onSuccess, service, showToast],
  );

  return { submit, isSubmitting };
}

export function requestCloseCreateUserDrawer(isDirty: boolean, onClose: () => void): void {
  if (isDirty) {
    const confirmed = window.confirm(CREATE_USER_UNSAVED_MESSAGE);
    if (!confirmed) return;
  }
  onClose();
}

export type UseCreateUserFormReturn = ReturnType<typeof useCreateUserForm>;
