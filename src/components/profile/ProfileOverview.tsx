import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfileInfoRow } from './profileUi';
import { PROFILE_PERSONAL_PLACEHOLDER } from './profileTypes';

export const ProfileOverview = memo(function ProfileOverview() {
  const personal = PROFILE_PERSONAL_PLACEHOLDER;

  return (
    <DashboardCard title="Personal Information" ariaLabel="Personal information">
      <dl className="space-y-3">
        <ProfileInfoRow label="Name" value={personal.name} />
        <ProfileInfoRow label="Email" value={personal.email} />
        <ProfileInfoRow label="Phone" value={personal.phone} />
        <ProfileInfoRow label="Country" value={personal.country} />
        <ProfileInfoRow label="Language" value={personal.language} />
        <ProfileInfoRow label="Timezone" value={personal.timezone} />
      </dl>
    </DashboardCard>
  );
});

export default ProfileOverview;
