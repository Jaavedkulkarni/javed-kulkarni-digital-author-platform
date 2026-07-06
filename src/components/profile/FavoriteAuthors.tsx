import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { AUTHOR_CARD_STYLE } from './profileTypes';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

export const FavoriteAuthors = memo(function FavoriteAuthors() {
  const { authors } = useReaderProfile();

  return (
    <DashboardCard title="Favorite Authors" ariaLabel="Favorite authors">
      <ResponsiveGrid viewMode="grid" ariaLabel="Favorite author cards">
        {authors.map((author) => (
          <div key={author.id} role="listitem" className="h-full">
            <div className={AUTHOR_CARD_STYLE}>{author.name}</div>
          </div>
        ))}
      </ResponsiveGrid>
    </DashboardCard>
  );
});

export default FavoriteAuthors;
