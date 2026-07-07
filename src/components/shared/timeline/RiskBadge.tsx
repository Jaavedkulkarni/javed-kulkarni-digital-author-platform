import { memo } from 'react';
import type { TimelineSeverity } from '../../../enterprise/timeline';
import { SEVERITY_DOT_STYLES, SEVERITY_STYLES } from '../../../enterprise/timeline';

interface RiskBadgeProps {
  severity: TimelineSeverity;
  label?: string;
}

export const RiskBadge = memo(function RiskBadge({ severity, label }: RiskBadgeProps) {
  const text = label ?? severity.charAt(0).toUpperCase() + severity.slice(1);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${SEVERITY_STYLES[severity]}`}
      aria-label={`Risk level: ${text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${SEVERITY_DOT_STYLES[severity]}`} aria-hidden="true" />
      {text}
    </span>
  );
});

export default RiskBadge;
