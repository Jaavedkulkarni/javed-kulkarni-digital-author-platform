import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';

const HEATMAP_PATTERN: number[][] = [  [0, 1, 2, 1, 3, 2, 0],
  [1, 2, 3, 4, 3, 2, 1],
  [0, 1, 2, 3, 4, 3, 1],
  [2, 3, 4, 3, 2, 1, 0],
  [1, 2, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 4, 3, 2],
  [1, 2, 1, 2, 3, 2, 1],
  [2, 3, 4, 3, 2, 1, 0],
  [0, 0, 1, 2, 3, 2, 1],
  [1, 2, 3, 4, 3, 2, 0],
  [0, 1, 1, 2, 3, 2, 1],
  [1, 2, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 3, 2, 1],
  [1, 2, 2, 3, 2, 1, 0],
];

const LEVEL_CLASS: Record<number, string> = {
  0: 'bg-gray-100 dark:bg-navy-800',
  1: 'bg-brand/20 dark:bg-gold-500/20',
  2: 'bg-brand/40 dark:bg-gold-500/35',
  3: 'bg-brand/60 dark:bg-gold-500/50',
  4: 'bg-brand dark:bg-gold-500',
};

export const HeatmapPlaceholder = memo(function HeatmapPlaceholder() {
  return (    <DashboardCard title="Reading Heatmap" ariaLabel="Reading heatmap placeholder">
      <div className="space-y-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Daily reading activity preview — full heatmap coming soon.
        </p>
        <div
          className="overflow-x-auto pb-1"
          role="img"
          aria-label="Reading activity heatmap placeholder showing sample daily blocks"
        >
          <div className="inline-flex min-w-0 gap-1">
            {HEATMAP_PATTERN.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
                {week.map((level, dayIndex) => (                  <span
                    key={`cell-${weekIndex}-${dayIndex}`}
                    aria-hidden="true"
                    className={`h-3 w-3 rounded-sm transition-colors sm:h-3.5 sm:w-3.5 ${LEVEL_CLASS[level] ?? LEVEL_CLASS[0]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-sm ${LEVEL_CLASS[level]}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
      <p className="sr-only">Reading heatmap placeholder. Data not yet available.</p>
    </DashboardCard>
  );
});

export default HeatmapPlaceholder;
