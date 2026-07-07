import { memo } from 'react';
import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { StatusSelector } from '../../create-user/components/StatusSelector';
import {
  EDIT_USER_ERROR_CLASS,
  EDIT_USER_FORM_ID,
  EDIT_USER_INPUT_CLASS,
  EDIT_USER_LABEL_CLASS,
  EDIT_USER_LANGUAGE_OPTIONS,
  EDIT_USER_SECTION_CLASS,
  EDIT_USER_TIMEZONE_OPTIONS,
} from '../edit-user.constants';
import type { EditUserFormValues } from '../edit-user.schema';
import type { EditUserDetail, EditUserRoleOption } from '../edit-user.types';
import { formatEditUserDate } from '../edit-user.utils';
import { EditUserAvatarSection } from './EditUserAvatarSection';
import { EditUserRoleManagement } from './EditUserRoleManagement';

interface EditUserFormProps {
  detail: EditUserDetail;
  register: UseFormRegister<EditUserFormValues>;
  setValue: UseFormSetValue<EditUserFormValues>;
  watch: UseFormWatch<EditUserFormValues>;
  errors: FieldErrors<EditUserFormValues>;
  roleOptions: EditUserRoleOption[];
  rolesLoading?: boolean;
  disabled?: boolean;
  onSubmit: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={EDIT_USER_ERROR_CLASS}>{message}</p>;
}

function SectionTitle({ id, children }: { id?: string; children: string }) {
  return (
    <h3 id={id} className="text-sm font-semibold text-white">
      {children}
    </h3>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className={EDIT_USER_LABEL_CLASS}>{label}</span>
      <p className="min-h-10 rounded-lg border border-navy-700/80 bg-navy-900/30 px-3 py-2 text-sm text-gray-400">
        {value}
      </p>
    </div>
  );
}

export const EditUserForm = memo(function EditUserForm({
  detail,
  register,
  setValue,
  watch,
  errors,
  roleOptions,
  rolesLoading = false,
  disabled = false,
  onSubmit,
}: EditUserFormProps) {
  const activeRoles = watch('activeRoles');
  const primaryRoleSlug = watch('primaryRoleSlug');
  const avatarFile = watch('avatarFile');
  const removeAvatar = watch('removeAvatar');

  const handleAssignRole = (role: string) => {
    const next = [...activeRoles, role];
    setValue('activeRoles', next, { shouldDirty: true, shouldValidate: true });
    if (!primaryRoleSlug) {
      setValue('primaryRoleSlug', role, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleRemoveRole = (role: string) => {
    const next = activeRoles.filter((item) => item !== role);
    setValue('activeRoles', next, { shouldDirty: true, shouldValidate: true });
    if (primaryRoleSlug === role && next.length > 0) {
      setValue('primaryRoleSlug', next[0], { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <form id={EDIT_USER_FORM_ID} onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }} className="space-y-6" noValidate>
      <section className={EDIT_USER_SECTION_CLASS} aria-labelledby="edit-user-personal">
        <SectionTitle id="edit-user-personal">Personal Information</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="edit-user-first-name" className={EDIT_USER_LABEL_CLASS}>
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-user-first-name"
              type="text"
              autoComplete="given-name"
              disabled={disabled}
              className={EDIT_USER_INPUT_CLASS}
              {...register('firstName')}
            />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <label htmlFor="edit-user-last-name" className={EDIT_USER_LABEL_CLASS}>
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-user-last-name"
              type="text"
              autoComplete="family-name"
              disabled={disabled}
              className={EDIT_USER_INPUT_CLASS}
              {...register('lastName')}
            />
            <FieldError message={errors.lastName?.message} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="edit-user-display-name" className={EDIT_USER_LABEL_CLASS}>
              Display Name
            </label>
            <input
              id="edit-user-display-name"
              type="text"
              disabled={disabled}
              className={EDIT_USER_INPUT_CLASS}
              {...register('displayName')}
            />
            <FieldError message={errors.displayName?.message} />
          </div>
          <div>
            <label htmlFor="edit-user-phone" className={EDIT_USER_LABEL_CLASS}>
              Phone
            </label>
            <input
              id="edit-user-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              disabled={disabled}
              className={EDIT_USER_INPUT_CLASS}
              {...register('phone')}
            />
            <FieldError message={errors.phone?.message} />
          </div>
        </div>
      </section>

      <section className={EDIT_USER_SECTION_CLASS} aria-labelledby="edit-user-account">
        <SectionTitle id="edit-user-account">Account</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="User ID" value={detail.id} />
          <ReadOnlyField label="Email" value={detail.email} />
          <ReadOnlyField label="Created Date" value={formatEditUserDate(detail.createdAt)} />
          <ReadOnlyField label="Last Login" value={formatEditUserDate(detail.lastLogin)} />
          <ReadOnlyField label="Registration Method" value={detail.registrationMethod} />
          <StatusSelector
            registration={register('status')}
            error={errors.status?.message}
            disabled={disabled}
          />
        </div>
      </section>

      <section className={EDIT_USER_SECTION_CLASS} aria-labelledby="edit-user-roles">
        <SectionTitle id="edit-user-roles">Role Management</SectionTitle>
        <EditUserRoleManagement
          activeRoles={activeRoles}
          primaryRoleSlug={primaryRoleSlug}
          roleOptions={roleOptions}
          rolesLoading={rolesLoading}
          disabled={disabled}
          error={errors.activeRoles?.message ?? errors.primaryRoleSlug?.message}
          onPrimaryRoleChange={(slug) =>
            setValue('primaryRoleSlug', slug, { shouldDirty: true, shouldValidate: true })
          }
          onAssignRole={handleAssignRole}
          onRemoveRole={handleRemoveRole}
        />
      </section>

      <section className={EDIT_USER_SECTION_CLASS} aria-labelledby="edit-user-preferences">
        <SectionTitle id="edit-user-preferences">Preferences</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="edit-user-language" className={EDIT_USER_LABEL_CLASS}>
              Language
            </label>
            <select
              id="edit-user-language"
              disabled={disabled}
              className={EDIT_USER_INPUT_CLASS}
              {...register('language')}
            >
              {EDIT_USER_LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.language?.message} />
          </div>
          <div>
            <label htmlFor="edit-user-timezone" className={EDIT_USER_LABEL_CLASS}>
              Timezone
            </label>
            <select
              id="edit-user-timezone"
              disabled={disabled}
              className={EDIT_USER_INPUT_CLASS}
              {...register('timezone')}
            >
              {EDIT_USER_TIMEZONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.timezone?.message} />
          </div>
        </div>
      </section>

      <section className={EDIT_USER_SECTION_CLASS} aria-labelledby="edit-user-avatar">
        <SectionTitle id="edit-user-avatar">Avatar</SectionTitle>
        <EditUserAvatarSection
          userId={detail.id}
          avatarUrl={detail.avatarUrl}
          avatarVersion={detail.avatarVersion}
          avatarFile={avatarFile}
          removeAvatar={removeAvatar}
          disabled={disabled}
          onAvatarFileChange={(file) =>
            setValue('avatarFile', file, { shouldDirty: true, shouldValidate: true })
          }
          onRemoveAvatar={(remove) =>
            setValue('removeAvatar', remove, { shouldDirty: true, shouldValidate: true })
          }
        />
      </section>

      <section className={EDIT_USER_SECTION_CLASS} aria-labelledby="edit-user-notes">
        <SectionTitle id="edit-user-notes">Notes</SectionTitle>
        <div>
          <label htmlFor="edit-user-notes" className={EDIT_USER_LABEL_CLASS}>
            Internal Notes
          </label>
          <textarea
            id="edit-user-notes"
            rows={4}
            disabled={disabled}
            placeholder="Optional notes for platform administrators…"
            className={`${EDIT_USER_INPUT_CLASS} min-h-[6rem] resize-y`}
            {...register('internalNotes')}
          />
          <FieldError message={errors.internalNotes?.message} />
        </div>
      </section>
    </form>
  );
});

export default EditUserForm;
