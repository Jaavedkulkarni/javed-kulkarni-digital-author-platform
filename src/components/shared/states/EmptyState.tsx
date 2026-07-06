import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { memo } from 'react';
import { EMPTY_STATE_CTA_CLASS, STATE_PANEL_SHELL_CLASS } from '../constants';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  description: string;
  ariaLabel: string;
  children?: ReactNode;
  descriptionClassName?: string;
  shellClassName?: string;
}

export const EmptyState = memo(function EmptyState({
  icon: Icon,
  title,
  description,
  ariaLabel,
  children,
  descriptionClassName = 'mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400',
  shellClassName = STATE_PANEL_SHELL_CLASS,
}: EmptyStateProps) {
  return (
    <div role="status" aria-label={ariaLabel} className={shellClassName}>
      <div
        aria-hidden="true"
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-navy-600 dark:bg-navy-900/50"
      >
        <Icon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
      </div>
      <h2 className="text-lg font-semibold text-navy-900 dark:text-white sm:text-xl">{title}</h2>
      <p className={descriptionClassName}>{description}</p>
      {children}
    </div>
  );
});

export const EmptyStateLink = memo(function EmptyStateLink({
  to,
  children,
  className = EMPTY_STATE_CTA_CLASS,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
});

export default EmptyState;
