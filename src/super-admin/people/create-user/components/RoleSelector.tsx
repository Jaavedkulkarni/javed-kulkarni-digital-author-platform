import { memo } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import {
  CREATE_USER_ERROR_CLASS,
  CREATE_USER_INPUT_CLASS,
  CREATE_USER_LABEL_CLASS,
} from '../create-user.constants';
import type { CreateUserRoleOption } from '../create-user.types';

interface RoleSelectorProps {
  registration: UseFormRegisterReturn;
  roles: CreateUserRoleOption[];
  loading?: boolean;
  error?: string;
  disabled?: boolean;
}

export const RoleSelector = memo(function RoleSelector({
  registration,
  roles,
  loading = false,
  error,
  disabled = false,
}: RoleSelectorProps) {
  return (
    <div>
      <label htmlFor="create-user-role" className={CREATE_USER_LABEL_CLASS}>
        Role <span className="text-red-400">*</span>
      </label>
      <select
        id="create-user-role"
        disabled={disabled || loading}
        className={CREATE_USER_INPUT_CLASS}
        {...registration}
      >
        <option value="">{loading ? 'Loading roles…' : 'Select a role'}</option>
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
      {error ? <p className={CREATE_USER_ERROR_CLASS}>{error}</p> : null}
    </div>
  );
});

export default RoleSelector;
