import { memo } from 'react';
import type { SystemRole } from '../../../types/roles';
import { SYSTEM_ROLE_LABELS } from '../../constants/role.constants';

interface RoleSelectorProps {
  roles: SystemRole[];
  value: SystemRole | '';
  onChange: (role: SystemRole) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

export const RoleSelector = memo(function RoleSelector({
  roles,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select a role',
  id = 'role-selector',
}: RoleSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-200">
        Role
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled || roles.length === 0}
        onChange={(event) => onChange(event.target.value as SystemRole)}
        className="w-full rounded-lg border border-navy-600 bg-navy-900/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-400/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{roles.length === 0 ? 'No roles available' : placeholder}</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {SYSTEM_ROLE_LABELS[role]}
          </option>
        ))}
      </select>
    </div>
  );
});

export default RoleSelector;
