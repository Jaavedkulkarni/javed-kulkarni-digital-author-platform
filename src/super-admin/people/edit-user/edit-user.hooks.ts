import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../context/ToastContext';
import { mapEdgeFunctionInvokeError } from '../../../lib/edge-functions';
import { useInvalidatePeople, usePeopleUserDetail } from '../hooks';
import type { EditUserDetail } from '../types/people.types';
import { EDIT_USER_UNSAVED_MESSAGE } from './edit-user.constants';
import { mapEditUserErrorToMessage } from './edit-user.errors';
import { validateChangedEditUserFields, type EditUserFormValues } from './edit-user.schema';
import { getEditUserService } from './edit-user.service';
import type { EditUserRoleOption } from './edit-user.types';
import {
  buildEditUserUpdatePayload,
  getChangedEditUserFieldKeys,
  hasEditUserChanges,
  mapEditDetailToFormValues,
} from './edit-user.utils';

export function useEditUserForm(detail: EditUserDetail | undefined) {
  const [initialValues, setInitialValues] = useState<EditUserFormValues | null>(null);

  const form = useForm<EditUserFormValues>({
    defaultValues: detail ? mapEditDetailToFormValues(detail) : undefined,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { reset, watch } = form;

  useEffect(() => {
    if (!detail) return;
    const values = mapEditDetailToFormValues(detail);
    setInitialValues(values);
    reset(values);
  }, [detail, reset]);

  const currentValues = watch();

  const isDirty = useMemo(() => {
    if (!initialValues) return false;
    return hasEditUserChanges(initialValues, currentValues);
  }, [currentValues, initialValues]);

  return { form, initialValues, isDirty };
}

export function useEditUserSubmit(
  userId: string,
  initialValues: EditUserFormValues | null,
  onSuccess?: () => void,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { invalidateEverything, invalidateDetail, invalidateTimelines } = useInvalidatePeople();
  const service = useMemo(() => getEditUserService(), []);

  const submit = useCallback(
    async (values: EditUserFormValues) => {
      if (!initialValues) return;

      const changedKeys = getChangedEditUserFieldKeys(initialValues, values);
      if (changedKeys.length === 0) {
        showToast('No changes to save');
        return;
      }

      const validationErrors = validateChangedEditUserFields(changedKeys, values);
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        showToast(firstError);
        return;
      }

      setIsSubmitting(true);
      try {
        if (values.removeAvatar) {
          await service.deleteAvatar(userId);
        } else if (values.avatarFile) {
          await service.uploadAvatar(userId, values.avatarFile);
        }

        const payload = buildEditUserUpdatePayload(userId, initialValues, values);
        if (payload) {
          await service.updateUser(payload);
        } else if (!values.avatarFile && !values.removeAvatar) {
          showToast('No changes to save');
          return;
        }

        showToast('User updated successfully');
        await Promise.all([invalidateEverything(), invalidateDetail(userId), invalidateTimelines(userId)]);
        onSuccess?.();
      } catch (error) {
        const message =
          (await mapEdgeFunctionInvokeError(error).catch(() => null)) ??
          mapEditUserErrorToMessage(error);
        showToast(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [initialValues, invalidateDetail, invalidateEverything, invalidateTimelines, onSuccess, service, showToast, userId],
  );

  return { submit, isSubmitting };
}

export function useEditUserPanel(userId: string | null, roleOptions: EditUserRoleOption[]) {
  const detailQuery = usePeopleUserDetail(userId, Boolean(userId));
  return { detailQuery, roleOptions };
}

export function requestCloseEditUserDrawer(isDirty: boolean, onClose: () => void): void {
  if (isDirty) {
    const confirmed = window.confirm(EDIT_USER_UNSAVED_MESSAGE);
    if (!confirmed) return;
  }
  onClose();
}

export type UseEditUserFormReturn = ReturnType<typeof useEditUserForm>['form'];
