import { memo } from 'react';
import type { SystemRole } from '../../types/roles';
import type { UserRoleAssignment } from '../types/role.types';
import { ROLE_PRIORITY } from '../constants/role.constants';
import { RoleBadge } from './RoleBadge';
import { RoleChip } from './RoleChip';

interface UserRoleListProps {
  roles?: SystemRole[];
  assignments?: UserRoleAssignment[];
  loading?: boolean;
  emptyLabel?: string;
  className?: string;
  variant?: 'badge' | 'chip';
}

function sortRoles(roles: SystemRole[]): SystemRole[] {
  return ROLE_PRIORITY.filter((role) => roles.includes(role));
}

export const UserRoleList = memo(function UserRoleList({
  roles = [],
  assignments = [],
  loading = false,
  emptyLabel = 'No roles assigned',
  className,
  variant = 'badge',
}: UserRoleListProps) {
  const resolvedRoles =
    roles.length > 0 ? sortRoles(roles) : sortRoles(assignments.map((assignment) => assignment.roleName));

  if (loading) {
    return (
      <div className={className} aria-busy="true" aria-live="polite">
        <span className="text-sm text-white/50">Loading roles…</span>
      </div>
    );
  }

  if (resolvedRoles.length === 0) {
    return (
      <div className={className} aria-live="polite">
        <span className="text-sm text-white/50">{emptyLabel}</span>
      </div>
    );
  }

  const Item = variant === 'chip' ? RoleChip : RoleBadge;

  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ''}`} aria-label="Assigned roles">
      {resolvedRoles.map((role) => (
        <li key={role}>
          <Item role={role} />
        </li>
      ))}
    </ul>
  );
});

export default UserRoleList;
