import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { AUTHOR_CARD_STYLE, PROFILE_AUTHORS_PLACEHOLDER } from './profileTypes';

export const FavoriteAuthors = memo(function FavoriteAuthors() {
  return (
    <DashboardCard title="Favorite Authors" ariaLabel="Favorite authors">
      <ResponsiveGrid viewMode="grid" ariaLabel="Favorite author cards">
        {PROFILE_AUTHORS_PLACEHOLDER.map((author) => (
          <div key={author.id} role="listitem" className="h-full">
            <div className={AUTHOR_CARD_STYLE}>{author.name}</div>
          </div>
        ))}
      </ResponsiveGrid>
    </DashboardCard>
  );
});

export default FavoriteAuthors;
