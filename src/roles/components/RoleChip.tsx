import { memo } from 'react';
import { Shield } from 'lucide-react';
import type { SystemRole } from '../../types/roles';
import { BADGE_BASE } from '../../components/shared/badges/StatusBadge';
import { ROLE_CHIP_STYLES, SYSTEM_ROLE_LABELS } from '../constants/role.constants';

interface RoleChipProps {
  role: SystemRole;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export const RoleChip = memo(function RoleChip({
  role,
  label,
  showIcon = true,
  className,
}: RoleChipProps) {
  const displayLabel = label ?? SYSTEM_ROLE_LABELS[role] ?? role;
  const styleClass = `${ROLE_CHIP_STYLES[role] ?? ROLE_CHIP_STYLES.reader}${className ? ` ${className}` : ''}`;

  return (
    <span className={`${BADGE_BASE} gap-1.5 ${styleClass}`} aria-label={`Role: ${displayLabel}`}>
      {showIcon ? <Shield className="h-3 w-3 shrink-0 opacity-80" aria-hidden /> : null}
      <span>{displayLabel}</span>
    </span>
  );
});

export default RoleChip;
