import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { PROFILE_GOALS_PLACEHOLDER, type ProfileGoalItem } from './profileTypes';

interface GoalRingProps {
  goal: ProfileGoalItem;
}

const GoalRing = memo(function GoalRing({ goal }: GoalRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (goal.ringPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 py-1 text-center">
      <div className="relative h-24 w-24 sm:h-28 sm:w-28" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-gray-200 dark:stroke-navy-600"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-brand dark:stroke-gold-500"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-semibold tabular-nums text-navy-900 dark:text-white sm:text-lg">
            {goal.ringPercent}%
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {goal.current} / {goal.target} {goal.unit}
      </p>
      <p className="sr-only">
        {goal.label}: {goal.current} of {goal.target} {goal.unit}, {goal.ringPercent}% complete
      </p>
    </div>
  );
});

export const ReadingGoalsSummary = memo(function ReadingGoalsSummary() {
  return (
    <DashboardCard title="Reading Goals" ariaLabel="Reading goals summary">
      <ResponsiveGrid viewMode="grid" ariaLabel="Reading goal progress">
        {PROFILE_GOALS_PLACEHOLDER.map((goal) => (
          <div key={goal.id} role="listitem" className="h-full rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-navy-700 dark:bg-navy-900/40">
            <p className="mb-2 text-center text-sm font-semibold text-navy-900 dark:text-white">{goal.label}</p>
            <GoalRing goal={goal} />
          </div>
        ))}
      </ResponsiveGrid>
    </DashboardCard>
  );
});

export default ReadingGoalsSummary;
