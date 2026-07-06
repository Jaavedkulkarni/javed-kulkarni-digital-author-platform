import { memo } from 'react';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileStatusBadge } from './profileUi';
import { MEMBERSHIP_BADGE_STYLE } from './profileTypes';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

export const ProfileHero = memo(function ProfileHero() {
  const { hero } = useReaderProfile();

  return (
    <section aria-label="Profile hero" className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800">
      <div className="bg-gradient-to-r from-brand/10 via-gold-500/10 to-transparent px-5 py-6 dark:from-brand/15 dark:via-gold-500/10 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <ProfileAvatar initials={hero.avatarInitials} name={hero.name} />

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-semibold text-navy-900 dark:text-white sm:text-2xl">{hero.name}</h2>
              <ProfileStatusBadge
                label={hero.membershipLabel}
                styleClass={MEMBERSHIP_BADGE_STYLE}
                ariaLabel={`Membership: ${hero.membershipLabel}`}
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reader since <span className="font-medium text-navy-800 dark:text-gray-200">{hero.readerSince}</span>
            </p>

            <p className="max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">{hero.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ProfileHero;
