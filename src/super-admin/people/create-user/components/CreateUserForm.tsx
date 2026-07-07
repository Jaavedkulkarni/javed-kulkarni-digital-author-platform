import { memo, useState } from 'react';
import { Eye, EyeOff, Upload } from 'lucide-react';
import type { UseCreateUserFormReturn } from '../create-user.hooks';
import {
  CREATE_USER_ERROR_CLASS,
  CREATE_USER_FORM_ID,
  CREATE_USER_INPUT_CLASS,
  CREATE_USER_LABEL_CLASS,
  CREATE_USER_LANGUAGE_OPTIONS,
  CREATE_USER_SECTION_CLASS,
  CREATE_USER_TIMEZONE_OPTIONS,
} from '../create-user.constants';
import type { CreateUserRoleOption } from '../create-user.types';
import { PasswordGenerator } from './PasswordGenerator';
import { PasswordStrength } from './PasswordStrength';
import { RoleSelector } from './RoleSelector';
import { StatusSelector } from './StatusSelector';

import type { CreateUserFormValues } from '../create-user.schema';

interface CreateUserFormProps {
  form: UseCreateUserFormReturn;
  roleOptions: CreateUserRoleOption[];
  rolesLoading?: boolean;
  disabled?: boolean;
  onSubmit: (values: CreateUserFormValues) => void | Promise<void>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={CREATE_USER_ERROR_CLASS}>{message}</p>;
}

function SectionTitle({ id, children }: { id?: string; children: string }) {
  return (
    <h3 id={id} className="text-sm font-semibold text-white">{children}</h3>
  );
}

export const CreateUserForm = memo(function CreateUserForm({
  form,
  roleOptions,
  rolesLoading = false,
  disabled = false,
  onSubmit,
}: CreateUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const passwordValue = watch('password') ?? '';

  return (
    <form
      id={CREATE_USER_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <section className={CREATE_USER_SECTION_CLASS} aria-labelledby="create-user-personal">
        <SectionTitle id="create-user-personal">Personal Information</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="create-user-first-name" className={CREATE_USER_LABEL_CLASS}>
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              id="create-user-first-name"
              type="text"
              autoComplete="given-name"
              disabled={disabled}
              className={CREATE_USER_INPUT_CLASS}
              {...register('firstName')}
            />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <label htmlFor="create-user-last-name" className={CREATE_USER_LABEL_CLASS}>
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              id="create-user-last-name"
              type="text"
              autoComplete="family-name"
              disabled={disabled}
              className={CREATE_USER_INPUT_CLASS}
              {...register('lastName')}
            />
            <FieldError message={errors.lastName?.message} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="create-user-display-name" className={CREATE_USER_LABEL_CLASS}>
              Display Name
            </label>
            <input
              id="create-user-display-name"
              type="text"
              disabled={disabled}
              className={CREATE_USER_INPUT_CLASS}
              {...register('displayName')}
            />
            <FieldError message={errors.displayName?.message} />
          </div>
          <div>
            <label htmlFor="create-user-email" className={CREATE_USER_LABEL_CLASS}>
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="create-user-email"
              type="email"
              autoComplete="email"
              disabled={disabled}
              className={CREATE_USER_INPUT_CLASS}
              {...register('email')}
            />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <label htmlFor="create-user-phone" className={CREATE_USER_LABEL_CLASS}>
              Phone
            </label>
            <input
              id="create-user-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              disabled={disabled}
              className={CREATE_USER_INPUT_CLASS}
              {...register('phone')}
            />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="sm:col-span-2">
            <span className={CREATE_USER_LABEL_CLASS}>Profile Photo Upload</span>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-navy-600 bg-navy-900/40 px-4 py-6">
              <Upload className="h-5 w-5 text-gray-500" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-300">Photo upload coming soon</p>
                <p className="text-xs text-gray-500">Placeholder — no file will be uploaded in this sprint.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={CREATE_USER_SECTION_CLASS} aria-labelledby="create-user-account">
        <SectionTitle id="create-user-account">Account</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RoleSelector
            registration={register('role')}
            roles={roleOptions}
            loading={rolesLoading}
            error={errors.role?.message}
            disabled={disabled}
          />
          <StatusSelector
            registration={register('status')}
            error={errors.status?.message}
            disabled={disabled}
          />
          <div className="sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                disabled={disabled}
                className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-gold-500 focus:ring-gold-400/50"
                {...register('emailVerificationRequired')}
              />
              Email Verification Required
            </label>
          </div>
          <div className="sm:col-span-2 space-y-3">
            <label htmlFor="create-user-password" className={CREATE_USER_LABEL_CLASS}>
              Temporary Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="create-user-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={disabled}
                className={`${CREATE_USER_INPUT_CLASS} pr-12`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={disabled}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
            <PasswordGenerator
              disabled={disabled}
              onGenerate={(password) =>
                setValue('password', password, { shouldDirty: true, shouldValidate: true })
              }
            />
            <PasswordStrength password={passwordValue} />
          </div>
        </div>
      </section>

      <section className={CREATE_USER_SECTION_CLASS} aria-labelledby="create-user-preferences">
        <SectionTitle id="create-user-preferences">Preferences</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="create-user-language" className={CREATE_USER_LABEL_CLASS}>
              Language
            </label>
            <select
              id="create-user-language"
              disabled={disabled}
              className={CREATE_USER_INPUT_CLASS}
              {...register('language')}
            >
              {CREATE_USER_LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.language?.message} />
          </div>
          <div>
            <label htmlFor="create-user-timezone" className={CREATE_USER_LABEL_CLASS}>
              Timezone
            </label>
            <select
              id="create-user-timezone"
              disabled={disabled}
              className={CREATE_USER_INPUT_CLASS}
              {...register('timezone')}
            >
              {CREATE_USER_TIMEZONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.timezone?.message} />
          </div>
        </div>
      </section>

      <section className={CREATE_USER_SECTION_CLASS} aria-labelledby="create-user-notes">
        <SectionTitle id="create-user-notes">Notes</SectionTitle>
        <div>
          <label htmlFor="create-user-notes" className={CREATE_USER_LABEL_CLASS}>
            Internal Notes
          </label>
          <textarea
            id="create-user-notes"
            rows={4}
            disabled={disabled}
            placeholder="Optional notes for platform administrators…"
            className={`${CREATE_USER_INPUT_CLASS} min-h-[6rem] resize-y`}
            {...register('internalNotes')}
          />
          <FieldError message={errors.internalNotes?.message} />
        </div>
      </section>
    </form>
  );
});

export default CreateUserForm;
