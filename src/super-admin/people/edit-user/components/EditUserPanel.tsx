import { memo, useCallback, useEffect } from 'react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import type { EditUserRoleOption } from '../edit-user.types';
import {
  requestCloseEditUserDrawer,
  useEditUserForm,
  useEditUserSubmit,
} from '../edit-user.hooks';
import { EDIT_USER_FORM_ID } from '../edit-user.constants';
import { EditUserForm } from './EditUserForm';
import type { EditUserDetail } from '../../types/people.types';

interface EditUserPanelProps {
  detail: EditUserDetail;
  roleOptions: EditUserRoleOption[];
  rolesLoading?: boolean;
  onClose: () => void;
  onSaved?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export const EditUserPanel = memo(function EditUserPanel({
  detail,
  roleOptions,
  rolesLoading = false,
  onClose,
  onSaved,
  onDirtyChange,
}: EditUserPanelProps) {
  const { form, initialValues, isDirty } = useEditUserForm(detail);
  const { submit, isSubmitting } = useEditUserSubmit(detail.id, initialValues, () => {
    onSaved?.();
    onClose();
  });

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const handleSubmit = useCallback(() => {
    void form.handleSubmit(submit)();
  }, [form, submit]);

  const requestClose = useCallback(() => {
    requestCloseEditUserDrawer(isDirty, onClose);
  }, [isDirty, onClose]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!isSubmitting && isDirty) handleSubmit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, isDirty, isSubmitting, requestClose]);

  const submitDisabled = !isDirty || isSubmitting || rolesLoading;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-5 sm:px-6">
        <EditUserForm
          detail={detail}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          roleOptions={roleOptions}
          rolesLoading={rolesLoading}
          disabled={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>

      <footer className="border-t border-navy-700 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            {submitDisabled && !isSubmitting
              ? 'Make changes to enable save'
              : 'Ctrl+Enter to save changes'}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={requestClose}
              className="inline-flex min-h-10 items-center rounded-lg border border-navy-600 bg-navy-900/60 px-5 text-sm font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <PrimaryButton
              placeholder
              interactive
              disabled={submitDisabled}
              onClick={handleSubmit}
              className="gap-2 px-5"
            >
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </div>
        <button type="submit" form={EDIT_USER_FORM_ID} className="sr-only">
          Save user changes
        </button>
      </footer>
    </div>
  );
});

export default EditUserPanel;
