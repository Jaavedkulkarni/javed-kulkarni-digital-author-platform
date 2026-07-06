import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfileInfoRow, ProfileStatusBadge } from './profileUi';
import { ACCOUNT_STATUS_STYLE, PROFILE_ACCOUNT_PLACEHOLDER } from './profileTypes';

export const AccountSummary = memo(function AccountSummary() {
  const account = PROFILE_ACCOUNT_PLACEHOLDER;

  return (
    <DashboardCard
      title="Account Summary"
      ariaLabel="Account summary"
      action={
        <ProfileStatusBadge
          label={account.accountStatus}
          styleClass={ACCOUNT_STATUS_STYLE}
          ariaLabel={`Account status: ${account.accountStatus}`}
        />
      }
    >
      <dl className="space-y-3">
        <ProfileInfoRow label="Joined Date" value={account.joinedDate} />
        <ProfileInfoRow label="Last Login" value={account.lastLogin} />
        <ProfileInfoRow label="Account Status" value={account.accountStatus} />
        <ProfileInfoRow label="Devices" value={String(account.devices)} />
      </dl>
    </DashboardCard>
  );
});

export default AccountSummary;
