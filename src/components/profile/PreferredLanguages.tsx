import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ProfileStatusBadge } from './profileUi';
import { LANGUAGE_BADGE_STYLE, PROFILE_LANGUAGES_PLACEHOLDER } from './profileTypes';

export const PreferredLanguages = memo(function PreferredLanguages() {
  return (
    <DashboardCard title="Preferred Languages" ariaLabel="Preferred languages">
      <div className="flex flex-wrap gap-2" role="list" aria-label="Preferred language badges">
        {PROFILE_LANGUAGES_PLACEHOLDER.map((language) => (
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
