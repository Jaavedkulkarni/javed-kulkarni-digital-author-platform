import type { ReactNode } from 'react';
import { memo } from 'react';
import { TOOLBAR_SHELL_CLASS } from '../constants';

interface PageToolbarProps {
  ariaLabel: string;
  announcement?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const PageToolbar = memo(function PageToolbar({
  ariaLabel,
  announcement,
  children,
  footer,
}: PageToolbarProps) {
  return (
    <section aria-label={ariaLabel} className={TOOLBAR_SHELL_CLASS}>
      {announcement ? (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">{children}</div>

      {footer}
    </section>
  );
});

export default PageToolbar;
