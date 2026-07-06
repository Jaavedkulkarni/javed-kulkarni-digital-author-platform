import type { ReactNode } from 'react';
import { memo } from 'react';

interface StatisticsGridProps {
  ariaLabel: string;
  columnsClass: string;
  children: ReactNode;
}

export const StatisticsGrid = memo(function StatisticsGrid({
  ariaLabel,
  columnsClass,
  children,
}: StatisticsGridProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={`grid grid-cols-2 items-stretch gap-3 sm:gap-4 ${columnsClass}`}
    >
      {children}
    </section>
  );
});

export default StatisticsGrid;
