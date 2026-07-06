import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { GENRE_CARD_STYLE } from './profileTypes';
import { useReaderProfile } from '../../reader/hooks/useReaderProfile';

export const FavoriteGenres = memo(function FavoriteGenres() {
  const { genres } = useReaderProfile();

  return (
    <DashboardCard title="Favorite Genres" ariaLabel="Favorite genres">
      <ResponsiveGrid viewMode="grid" ariaLabel="Favorite genre cards">
        {genres.map((genre) => (
          <div key={genre.id} role="listitem" className="h-full">
            <div className={GENRE_CARD_STYLE}>{genre.label}</div>
          </div>
        ))}
      </ResponsiveGrid>
    </DashboardCard>
  );
});

export default FavoriteGenres;
