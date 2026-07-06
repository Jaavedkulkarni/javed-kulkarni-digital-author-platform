import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';
import { GOALS_MOCK, type ReadingGoalPlaceholder } from './readingInsightsTypes';
import { useReadingInsights } from '../../reader/hooks/useReadingInsights';

interface GoalRingProps {
  goal: ReadingGoalPlaceholder;
}

const GoalRing = memo(function GoalRing({ goal }: GoalRingProps) {
  const percent = goal.ringPercent;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2.5 py-1 text-center">
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
            className="stroke-brand transition-[stroke-dashoffset] duration-500 dark:stroke-gold-500"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-semibold tabular-nums text-navy-900 dark:text-white sm:text-lg">
            {percent}%
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {goal.current} / {goal.target} {goal.unit}
      </p>
      <p className="sr-only">
        {goal.label}: {goal.current} of {goal.target} {goal.unit}, {percent}% complete
      </p>
    </div>
  );
});

export const ReadingGoals = memo(function ReadingGoals() {
  const { goals: insightGoals } = useReadingInsights();
  const goals: ReadingGoalPlaceholder[] =
    insightGoals.length > 0
      ? insightGoals
      : GOALS_MOCK;

  return (
    <div className="space-y-4 sm:space-y-5">
      <ResponsiveGrid viewMode="grid" ariaLabel="Reading goals">
        {goals.map((goal) => (
          <div key={goal.id} role="listitem" className="h-full">
            <DashboardCard
              title={goal.label}
              ariaLabel={`${goal.label} progress`}
              className="h-full transition-shadow duration-200 hover:shadow-md"
            >
              <GoalRing goal={goal} />
            </DashboardCard>
          </div>
        ))}
      </ResponsiveGrid>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <SecondaryButton disabled>Set Monthly Goal</SecondaryButton>
        <SecondaryButton disabled>Adjust Weekly Goal</SecondaryButton>
      </div>
    </div>
  );
});

export default ReadingGoals;
