import { memo } from 'react';

export const BADGE_BASE =
  'inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none';

interface StatusBadgeProps {
  label: string;
  styleClass: string;
  ariaLabel?: string;
}

export const StatusBadge = memo(function StatusBadge({ label, styleClass, ariaLabel }: StatusBadgeProps) {
  return (
    <span className={`${BADGE_BASE} ${styleClass}`} aria-label={ariaLabel ?? label}>
      {label}
    </span>
  );
});

export default StatusBadge;
