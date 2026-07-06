import type { ReactNode } from 'react';
import { memo } from 'react';

interface PageHeaderProps {
  title?: string;
  subtitle: string;
  actions?: ReactNode;
}

export const PageHeader = memo(function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="space-y-1">
      {title ? (
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-semibold text-navy-900 dark:text-white sm:text-2xl">{title}</h1>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : actions ? (
        <div className="flex items-start justify-end gap-3">{actions}</div>
      ) : null}
      <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">{subtitle}</p>
    </header>
  );
});

export default PageHeader;
