import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatisticCard } from '../library/StatisticCard';
import type { MembershipStatus } from './membershipTypes';
import {
  MEMBERSHIP_STATUS_LABELS,
  MEMBERSHIP_STATUS_STYLES,
} from './membershipTypes';
import { MembershipBadge, MembershipPrimaryButton } from './membershipUi';
import { MembershipGuestState } from './MembershipGuestState';
import { MembershipProgress } from './MembershipProgress';

interface MembershipStatusSectionProps {
  isGuest: boolean;
  currentPlan: string;
  status: MembershipStatus;
  expiryDate: string;
  daysRemaining: string;
  daysRemainingValue: number | null;
  planDurationDays: number;
}

export const MembershipStatusSection = memo(function MembershipStatusSection({
  isGuest,
  currentPlan,
  status,
  expiryDate,
  daysRemaining,
  daysRemainingValue,
  planDurationDays,
}: MembershipStatusSectionProps) {
  if (isGuest) {
    return <MembershipGuestState />;
  }

  if (status === 'expired') {
    return (
      <section aria-label="Expired membership status">
        <DashboardCard
          title="Current Membership Status"
          ariaLabel="Expired membership status"
          footer={<MembershipPrimaryButton>Reactivate Membership</MembershipPrimaryButton>}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              <StatisticCard label="Current Plan" value={currentPlan} />
              <div
                className="flex h-full min-h-[5.5rem] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:min-h-[6rem] sm:p-5"
                role="group"
                aria-label={`Status: ${MEMBERSHIP_STATUS_LABELS.expired}`}
              >
                <p className="text-xs font-medium leading-snug text-gray-500 dark:text-gray-400">Status</p>
                <div className="mt-2">
                  <MembershipBadge
                    label={MEMBERSHIP_STATUS_LABELS.expired}
                    styleClass={MEMBERSHIP_STATUS_STYLES.expired}
                  />
                </div>
              </div>
              <StatisticCard label="Expiry Date" value={expiryDate} />
            </div>
          </div>
        </DashboardCard>
      </section>
    );
  }

  return (
    <section aria-label="Active membership status">
      <DashboardCard
        title="Current Membership Status"
        ariaLabel="Active membership status"
        footer={<MembershipPrimaryButton>Renew Membership</MembershipPrimaryButton>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-4">
            <StatisticCard label="Current Plan" value={currentPlan} />
            <div
              className="flex h-full min-h-[5.5rem] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:min-h-[6rem] sm:p-5"
              role="group"
              aria-label={`Status: ${MEMBERSHIP_STATUS_LABELS.active}`}
            >
              <p className="text-xs font-medium leading-snug text-gray-500 dark:text-gray-400">Status</p>
              <div className="mt-2">
                <MembershipBadge
                  label={MEMBERSHIP_STATUS_LABELS.active}
                  styleClass={MEMBERSHIP_STATUS_STYLES.active}
                />
              </div>
            </div>
            <StatisticCard label="Expiry Date" value={expiryDate} />
            <StatisticCard label="Days Remaining" value={daysRemaining} />
          </div>

          {daysRemainingValue !== null && daysRemainingValue > 0 ? (
            <MembershipProgress
              daysRemaining={daysRemainingValue}
              planDurationDays={planDurationDays}
            />
          ) : null}
        </div>
      </DashboardCard>
    </section>
  );
});

export default MembershipStatusSection;
