import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfileInfoRow, ProfileStatusBadge } from './profileUi';
import { ACCOUNT_STATUS_STYLE } from './profileTypes';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

export const MembershipSummary = memo(function MembershipSummary() {
  const { membership } = useReaderProfile();

  return (
    <DashboardCard
      title="Membership Summary"
      ariaLabel="Membership summary"
      action={
        <ProfileStatusBadge
          label={membership.status}
          styleClass={ACCOUNT_STATUS_STYLE}
          ariaLabel={`Membership status: ${membership.status}`}
        />
      }
    >
      <dl className="mb-4 space-y-3">
        <ProfileInfoRow label="Current Plan" value={membership.currentPlan} />
        <ProfileInfoRow label="Renew Date" value={membership.renewDate} />
        <ProfileInfoRow label="Status" value={membership.status} />
      </dl>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Benefits
        </h3>
        <ul className="space-y-1.5" aria-label="Membership benefits">
          {membership.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  );
});

export default MembershipSummary;
