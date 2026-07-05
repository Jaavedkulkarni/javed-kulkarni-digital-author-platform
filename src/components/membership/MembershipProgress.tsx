import { memo, useMemo } from 'react';

interface MembershipProgressProps {
  daysRemaining: number;
  planDurationDays: number;
}

export const MembershipProgress = memo(function MembershipProgress({
  daysRemaining,
  planDurationDays,
}: MembershipProgressProps) {
  const progressPercent = useMemo(() => {
    if (planDurationDays <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((daysRemaining / planDurationDays) * 100)));
  }, [daysRemaining, planDurationDays]);

  return (
    <div
      role="group"
      aria-label="Membership progress"
      className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-navy-700 dark:bg-navy-900/40 sm:p-5"
    >
      <h3 className="text-sm font-semibold text-navy-900 dark:text-white">Membership Progress</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Expires in{' '}
        <span className="font-medium tabular-nums text-navy-900 dark:text-white">
          {daysRemaining} Days Remaining
        </span>
      </p>
      <div
        role="progressbar"
        aria-valuenow={daysRemaining}
        aria-valuemin={0}
        aria-valuemax={planDurationDays}
        aria-label={`${daysRemaining} of ${planDurationDays} days remaining`}
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
});

export default MembershipProgress;
