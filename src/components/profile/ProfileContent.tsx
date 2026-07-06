import { ProfilePageHeader } from './ProfilePageHeader';
import { ProfileHero } from './ProfileHero';
import { ProfileOverview } from './ProfileOverview';
import { MembershipSummary } from './MembershipSummary';
import { ReadingSummary } from './ReadingSummary';
import { FavoriteGenres } from './FavoriteGenres';
import { FavoriteAuthors } from './FavoriteAuthors';
import { PreferredLanguages } from './PreferredLanguages';
import { ReadingGoalsSummary } from './ReadingGoalsSummary';
import { DownloadsSummary } from './DownloadsSummary';
import { AccountSummary } from './AccountSummary';
import { ProfileActions } from './ProfileActions';

export function ProfileContent() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <ProfilePageHeader />
      <ProfileHero />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <ProfileOverview />
        <MembershipSummary />
      </div>

      <ReadingSummary />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <FavoriteGenres />
        <FavoriteAuthors />
      </div>

      <PreferredLanguages />
      <ReadingGoalsSummary />
      <DownloadsSummary />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <AccountSummary />
        <ProfileActions />
      </div>
    </div>
  );
}

export default ProfileContent;
