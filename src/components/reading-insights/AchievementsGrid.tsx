import { Award, Lock } from 'lucide-react';
import { memo, useMemo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatusBadge } from '../shared/badges/StatusBadge';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { ACHIEVEMENTS_PLACEHOLDER } from './readingInsightsTypes';

const UNLOCKED_BADGE =
  'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300';

const LOCKED_BADGE =
  'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400';

const UNLOCKED_CARD =
  'border-emerald-200/80 bg-emerald-50/40 shadow-sm shadow-emerald-100/80 ring-1 ring-emerald-100 transition-shadow duration-200 hover:shadow-md dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:shadow-emerald-900/20 dark:ring-emerald-500/10';

const LOCKED_CARD =
  'border-gray-200 bg-white transition-shadow duration-200 hover:shadow-md dark:border-navy-700 dark:bg-navy-800';

export const AchievementsGrid = memo(function AchievementsGrid() {
  const achievements = useMemo(() => ACHIEVEMENTS_PLACEHOLDER, []);

  return (
    <ResponsiveGrid viewMode="grid" ariaLabel="Reading achievements">
      {achievements.map((achievement) => {
        const unlocked = achievement.status === 'unlocked';

        return (
          <div key={achievement.id} role="listitem" className="h-full">
            <DashboardCard
              title={achievement.title}
              ariaLabel={`Achievement: ${achievement.title}`}
              className={`h-full ${unlocked ? UNLOCKED_CARD : LOCKED_CARD}`}
              action={
                <StatusBadge
                  label={unlocked ? 'Unlocked' : 'Locked'}
                  styleClass={unlocked ? UNLOCKED_BADGE : LOCKED_BADGE}
                  ariaLabel={`${achievement.title} is ${unlocked ? 'unlocked' : 'locked'}`}
                />
              }
            >
              <div className="flex min-h-[3.5rem] items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    unlocked
                      ? 'bg-emerald-100 text-emerald-600 shadow-sm shadow-emerald-200/60 dark:bg-emerald-500/20 dark:text-emerald-300 dark:shadow-emerald-900/30'
                      : 'bg-gray-100 text-gray-400 dark:bg-navy-700 dark:text-gray-500'
                  }`}
                  aria-hidden="true"
                >
                  {unlocked ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>
                <p className="pt-0.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {achievement.description}
                </p>
              </div>
            </DashboardCard>
          </div>
        );
      })}
    </ResponsiveGrid>
  );
});

export default AchievementsGrid;
