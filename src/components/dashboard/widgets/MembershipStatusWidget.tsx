import { useReader } from '../../../context/ReaderContext';
import { DashboardCard } from '../DashboardCard';
import { DashboardActionButton, DashboardMetric } from './dashboardWidgetUi';

function formatPlanLabel(status: string | undefined): string {
  if (!status || status === 'free') return 'Free';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function MembershipStatusWidget() {
  const { profile } = useReader();
  const plan = formatPlanLabel(profile?.membership_status);
  const isActiveMembership = Boolean(profile?.membership_status && profile.membership_status !== 'free');

  return (
    <DashboardCard title="Membership Status" ariaLabel="Membership status widget">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DashboardMetric label="Current Plan" value={plan} />
          <DashboardMetric
            label="Status"
            value={isActiveMembership ? 'Active' : 'No active membership'}
          />
          <DashboardMetric label="Days Remaining" value="—" />
        </div>
        <DashboardActionButton disabled={!isActiveMembership}>
          Renew Membership
        </DashboardActionButton>
      </div>
    </DashboardCard>
  );
}

export default MembershipStatusWidget;
