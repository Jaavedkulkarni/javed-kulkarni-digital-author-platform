import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfileStatusBadge } from './profileUi';
import { LANGUAGE_BADGE_STYLE } from './profileTypes';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

export const PreferredLanguages = memo(function PreferredLanguages() {
  const { languages } = useReaderProfile();

  return (
    <DashboardCard title="Preferred Languages" ariaLabel="Preferred languages">
      <div className="flex flex-wrap gap-2" role="list" aria-label="Preferred language badges">
        {languages.map((language) => (
          <div key={language} role="listitem">
            <ProfileStatusBadge
              label={language}
              styleClass={LANGUAGE_BADGE_STYLE}
              ariaLabel={`Preferred language: ${language}`}
            />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
});

export default PreferredLanguages;
