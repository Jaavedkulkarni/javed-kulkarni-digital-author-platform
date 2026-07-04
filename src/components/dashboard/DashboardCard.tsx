import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function DashboardCard({
  title,
  children,
  action,
  footer,
  className = '',
  ariaLabel,
}: DashboardCardProps) {
  return (
    <section
      aria-label={ariaLabel ?? title}
      className={`flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-gold-400/40 dark:border-navy-700 dark:bg-navy-800 sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-navy-900 dark:text-white sm:text-lg">{title}</h2>
        {action}
      </div>

      <div className="flex-1">{children}</div>

      {footer ? <div className="mt-4 border-t border-gray-100 pt-4 dark:border-navy-700">{footer}</div> : null}
    </section>
  );
}

export default DashboardCard;
