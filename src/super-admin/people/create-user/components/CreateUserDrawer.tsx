import { memo, useCallback, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import {
  CREATE_USER_DEFAULT_VALUES,
  CREATE_USER_DRAWER_MAX_WIDTH,
  CREATE_USER_DRAWER_SUBTITLE,
  CREATE_USER_DRAWER_TITLE,
  CREATE_USER_DRAWER_Z_INDEX,
  CREATE_USER_TRANSITION_MS,
} from '../create-user.constants';
import {
  requestCloseCreateUserDrawer,
  useCreateUserForm,
  useCreateUserSubmit,
} from '../create-user.hooks';
import type { CreateUserRoleOption } from '../create-user.types';
import { CreateUserForm } from './CreateUserForm';

interface CreateUserDrawerProps {
  open: boolean;
  onClose: () => void;
  roleOptions: CreateUserRoleOption[];
  rolesLoading?: boolean;
}

export const CreateUserDrawer = memo(function CreateUserDrawer({
  open,
  onClose,
  roleOptions,
  rolesLoading = false,
}: CreateUserDrawerProps) {
  const form = useCreateUserForm();

  const handleCloseSuccess = useCallback(() => {
    form.reset(CREATE_USER_DEFAULT_VALUES);
    onClose();
  }, [form, onClose]);

  const { submit, isSubmitting } = useCreateUserSubmit(handleCloseSuccess);

  const {
    formState: { isValid, isDirty },
    handleSubmit,
    reset,
  } = form;

  useEffect(() => {
    if (!open) {
      reset(CREATE_USER_DEFAULT_VALUES);
    }
  }, [open, reset]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [open]);

  const requestClose = useCallback(() => {
    requestCloseCreateUserDrawer(isDirty, () => {
      reset(CREATE_USER_DEFAULT_VALUES);
      onClose();
    });
  }, [isDirty, onClose, reset]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (isValid && !isSubmitting) {
          void handleSubmit(submit)();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, isSubmitting, isValid, open, requestClose, submit]);

  const submitDisabled = !isValid || isSubmitting || rolesLoading;

  const shortcutHint = useMemo(
    () => (submitDisabled ? 'Complete required fields to create user' : 'Ctrl+Enter to submit'),
    [submitDisabled],
  );

  if (!open) return null;

  return (
    <div className={`fixed inset-0 ${CREATE_USER_DRAWER_Z_INDEX}`} aria-hidden={false}>
      <button
        type="button"
        aria-label="Close create user drawer backdrop"
        onClick={requestClose}
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-user-drawer-title"
        className={`absolute right-0 top-0 flex h-full w-full ${CREATE_USER_DRAWER_MAX_WIDTH} flex-col border-l border-navy-700 bg-[#0f1117] shadow-2xl transition-transform duration-300 ease-out translate-x-0`}
        style={{ transitionDuration: `${CREATE_USER_TRANSITION_MS}ms` }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-navy-700 px-6 py-5">
          <div>
            <h2 id="create-user-drawer-title" className="text-xl font-semibold text-white">
              {CREATE_USER_DRAWER_TITLE}
            </h2>
            <p className="mt-1 text-sm text-gray-400">{CREATE_USER_DRAWER_SUBTITLE}</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close create user drawer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-navy-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <CreateUserForm
            form={form}
            roleOptions={roleOptions}
            rolesLoading={rolesLoading}
            disabled={isSubmitting}
            onSubmit={submit}
          />
        </div>

        <footer className="border-t border-navy-700 px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">{shortcutHint}</p>
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
                onClick={() => void handleSubmit(submit)()}
                className="gap-2 px-5"
              >
                {isSubmitting ? 'Creating…' : 'Create User'}
              </PrimaryButton>
            </div>
          </div>
        </footer>
      </aside>
    </div>
  );
});

export default CreateUserDrawer;
