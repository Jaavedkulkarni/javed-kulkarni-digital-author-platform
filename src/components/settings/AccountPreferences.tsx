import { memo } from 'react';
import { MOCK_ACCOUNT } from '../../data/mockSettings';
import { DashboardCard } from '../dashboard/DashboardCard';
import { SettingsInfoRow } from './settingsUi';

export const AccountPreferences = memo(function AccountPreferences() {
  return (
    <DashboardCard title="Account Preferences" ariaLabel="Account preferences">
      <dl className="space-y-3">
        <SettingsInfoRow label="Email" value={MOCK_ACCOUNT.email} />
        <SettingsInfoRow label="Phone" value={MOCK_ACCOUNT.phone} />
        <SettingsInfoRow label="Password" value={MOCK_ACCOUNT.password} />
        <SettingsInfoRow label="Connected Devices" value={MOCK_ACCOUNT.connectedDevices} />
        <SettingsInfoRow label="Session Management" value={MOCK_ACCOUNT.sessionManagement} />
      </dl>
    </DashboardCard>
  );
});

export default AccountPreferences;
