import { memo } from 'react';
import type { SystemRole } from '../../types/roles';
import { StatusBadge } from '../../components/shared/badges/StatusBadge';
import { ROLE_BADGE_STYLES, SYSTEM_ROLE_LABELS } from '../constants/role.constants';

interface RoleBadgeProps {
  role: SystemRole;
  label?: string;
  className?: string;
}

export const RoleBadge = memo(function RoleBadge({ role, label, className }: RoleBadgeProps) {
  const displayLabel = label ?? SYSTEM_ROLE_LABELS[role] ?? role;
  const styleClass = `${ROLE_BADGE_STYLES[role] ?? ROLE_BADGE_STYLES.reader}${className ? ` ${className}` : ''}`;

  return <StatusBadge label={displayLabel} styleClass={styleClass} ariaLabel={`Role: ${displayLabel}`} />;
});

export default RoleBadge;
