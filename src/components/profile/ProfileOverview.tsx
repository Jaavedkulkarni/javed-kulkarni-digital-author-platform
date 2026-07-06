import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfileInfoRow } from './profileUi';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

export const ProfileOverview = memo(function ProfileOverview() {
  const { personal } = useReaderProfile();

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
