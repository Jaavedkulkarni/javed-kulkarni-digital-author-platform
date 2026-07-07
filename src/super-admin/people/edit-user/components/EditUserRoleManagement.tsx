import { memo, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import {
  EDIT_USER_ERROR_CLASS,
  EDIT_USER_INPUT_CLASS,
  EDIT_USER_LABEL_CLASS,
} from '../edit-user.constants';
import type { EditUserRoleOption } from '../edit-user.types';

interface EditUserRoleManagementProps {
  activeRoles: string[];
  primaryRoleSlug: string;
  roleOptions: EditUserRoleOption[];
  rolesLoading?: boolean;
  disabled?: boolean;
  error?: string;
  onPrimaryRoleChange: (slug: string) => void;
  onAssignRole: (role: string) => void;
  onRemoveRole: (role: string) => void;
}

function formatRoleLabel(slug: string): string {
  return slug
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export const EditUserRoleManagement = memo(function EditUserRoleManagement({
  activeRoles,
  primaryRoleSlug,
  roleOptions,
  rolesLoading = false,
  disabled = false,
  error,
  onPrimaryRoleChange,
  onAssignRole,
  onRemoveRole,
}: EditUserRoleManagementProps) {
  const availableRoles = useMemo(
    () => roleOptions.filter((option) => !activeRoles.includes(option.value)),
    [activeRoles, roleOptions],
  );

  const handleAssignChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!value) return;
    onAssignRole(value);
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div>
        <span className={EDIT_USER_LABEL_CLASS}>Current Roles</span>
        {activeRoles.length === 0 ? (
          <p className="text-sm text-gray-500">No roles assigned.</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {activeRoles.map((role) => (
              <li
                key={role}
                className="inline-flex items-center gap-1 rounded-full border border-navy-600 bg-navy-900/60 px-3 py-1 text-xs text-gray-200"
              >
                {formatRoleLabel(role)}
                {role === primaryRoleSlug ? (
                  <span className="ml-1 text-[10px] uppercase tracking-wide text-gold-400">Primary</span>
                ) : null}
                <button
                  type="button"
                  disabled={disabled || activeRoles.length <= 1}
                  onClick={() => onRemoveRole(role)}
                  aria-label={`Remove ${formatRoleLabel(role)} role`}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded text-gray-400 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-user-assign-role" className={EDIT_USER_LABEL_CLASS}>
            Assign Role
          </label>
          <div className="relative">
            <select
              id="edit-user-assign-role"
              disabled={disabled || rolesLoading || availableRoles.length === 0}
              className={EDIT_USER_INPUT_CLASS}
              defaultValue=""
              onChange={handleAssignChange}
            >
              <option value="">
                {rolesLoading
                  ? 'Loading roles…'
                  : availableRoles.length === 0
                    ? 'All roles assigned'
                    : 'Select role to assign'}
              </option>
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <Plus className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <label htmlFor="edit-user-primary-role" className={EDIT_USER_LABEL_CLASS}>
            Primary Role
          </label>
          <select
            id="edit-user-primary-role"
            disabled={disabled || activeRoles.length === 0}
            className={EDIT_USER_INPUT_CLASS}
            value={primaryRoleSlug}
            onChange={(event) => onPrimaryRoleChange(event.target.value)}
          >
            {activeRoles.map((role) => (
              <option key={role} value={role}>
                {formatRoleLabel(role)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <p className={EDIT_USER_ERROR_CLASS}>{error}</p> : null}
    </div>
  );
});

export default EditUserRoleManagement;
