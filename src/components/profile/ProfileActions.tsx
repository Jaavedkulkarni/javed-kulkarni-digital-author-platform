import { memo } from 'react';
import { useRoles } from '../../context/RoleContext';
import { isAuthor } from '../../lib/permissions';
import { useBecomeAuthor } from '../../hooks/useOrganization';
import { PrimaryButton } from '../shared/buttons/PrimaryButton';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfilePrimaryButton, ProfileSecondaryButton } from './profileUi';
import { PROFILE_ACTIONS } from './profileTypes';

export const ProfileActions = memo(function ProfileActions() {
  const { roles } = useRoles();
  const { becomeAuthor, isPending, error } = useBecomeAuthor();
  const hasAuthorRole = isAuthor(roles);

  return (
    <DashboardCard title="Actions" ariaLabel="Profile actions">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <ProfilePrimaryButton>{PROFILE_ACTIONS[0]}</ProfilePrimaryButton>
        <ProfileSecondaryButton>{PROFILE_ACTIONS[1]}</ProfileSecondaryButton>
        <ProfileSecondaryButton>{PROFILE_ACTIONS[2]}</ProfileSecondaryButton>
        <ProfileSecondaryButton>{PROFILE_ACTIONS[3]}</ProfileSecondaryButton>
        {!hasAuthorRole && (
          <PrimaryButton interactive onClick={() => void becomeAuthor()} disabled={isPending}>
            {isPending ? 'Activating...' : 'Become an Author'}
          </PrimaryButton>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">
          {error instanceof Error ? error.message : 'Could not activate author access.'}
        </p>
      )}
    </DashboardCard>
  );
});

export default ProfileActions;
