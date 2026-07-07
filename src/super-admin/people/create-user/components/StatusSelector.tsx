import { memo } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import {
  CREATE_USER_ERROR_CLASS,
  CREATE_USER_INPUT_CLASS,
  CREATE_USER_LABEL_CLASS,
  CREATE_USER_STATUS_OPTIONS,
} from '../create-user.constants';

interface StatusSelectorProps {
  registration: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
}

export const StatusSelector = memo(function StatusSelector({
  registration,
  error,
  disabled = false,
}: StatusSelectorProps) {
  return (
    <div>
      <label htmlFor="create-user-status" className={CREATE_USER_LABEL_CLASS}>
        Status <span className="text-red-400">*</span>
      </label>
      <select
        id="create-user-status"
        disabled={disabled}
        className={CREATE_USER_INPUT_CLASS}
        {...registration}
      >
        {CREATE_USER_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className={CREATE_USER_ERROR_CLASS}>{error}</p> : null}
    </div>
  );
});

export default StatusSelector;
