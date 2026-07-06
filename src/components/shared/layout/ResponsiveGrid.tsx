import type { ReactNode } from 'react';
import { memo } from 'react';

type ViewMode = 'grid' | 'list';

interface ResponsiveGridProps {
  viewMode?: ViewMode;
  ariaLabel: string;
  children: ReactNode;
}

export const ResponsiveGrid = memo(function ResponsiveGrid({
  viewMode = 'grid',
  ariaLabel,
  children,
}: ResponsiveGridProps) {
  const listClassName =
    viewMode === 'list'
      ? 'flex flex-col gap-4 sm:gap-5'
      : 'grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div role="list" aria-label={ariaLabel} className={listClassName}>
      {children}
    </div>
  );
});

export default ResponsiveGrid;
