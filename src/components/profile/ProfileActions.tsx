import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfilePrimaryButton, ProfileSecondaryButton } from './profileUi';
import { PROFILE_ACTIONS } from './profileTypes';

export const ProfileActions = memo(function ProfileActions() {
  return (
    <DashboardCard title="Actions" ariaLabel="Profile actions">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <ProfilePrimaryButton>{PROFILE_ACTIONS[0]}</ProfilePrimaryButton>
        <ProfileSecondaryButton>{PROFILE_ACTIONS[1]}</ProfileSecondaryButton>
        <ProfileSecondaryButton>{PROFILE_ACTIONS[2]}</ProfileSecondaryButton>
        <ProfileSecondaryButton>{PROFILE_ACTIONS[3]}</ProfileSecondaryButton>
      </div>
    </DashboardCard>
  );
});

export default ProfileActions;
