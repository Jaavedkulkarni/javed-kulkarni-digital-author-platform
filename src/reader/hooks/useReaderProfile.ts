import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReader } from '../../context/ReaderContext';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchLibraryBooks } from '../services/library.service';
import { fetchWishlistBooks } from '../services/wishlist.service';
import { fetchReadingProgress } from '../services/readingProgress.service';
import { fetchDownloads } from '../services/downloads.service';
import { fetchMembership } from '../services/membership.service';
import {
  buildProfileAccountData,
  buildProfileAuthors,
  buildProfileDownloadsData,
  buildProfileGenres,
  buildProfileHeroData,
  buildProfileLanguages,
  buildProfileMembershipData,
  buildProfilePersonalInfo,
  buildProfileReadingData,
} from '../services/profile.service';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useReaderProfile() {
  const userId = useReaderUserId();
  const { user, profile } = useReader();
  const isOnline = useOnlineStatus();

  const query = useQuery({
    queryKey: readerQueryKeys.profile(userId ?? 'guest'),
    queryFn: async () => {
      const [library, wishlist, progress, downloads, membership] = await Promise.all([
        fetchLibraryBooks(userId!),
        fetchWishlistBooks(userId!),
        fetchReadingProgress(userId!),
        fetchDownloads(userId!),
        fetchMembership(userId!),
      ]);
      return { library, wishlist, progress, downloads, membership };
    },
    enabled: Boolean(userId) && isOnline,
  });

  const aggregate = useMemo(
    () => ({
      profile,
      email: user?.email ?? null,
      membership: query.data?.membership ?? {
        currentPlanId: 'free' as const,
        status: 'none' as const,
        expiryDate: null,
        daysRemaining: null,
      },
      library: query.data?.library ?? [],
      wishlist: query.data?.wishlist ?? [],
      progress: query.data?.progress ?? [],
      downloads: query.data?.downloads ?? [],
    }),
    [profile, user?.email, query.data]
  );

  return {
    hero: buildProfileHeroData(aggregate),
    personal: buildProfilePersonalInfo(aggregate),
    membership: buildProfileMembershipData(aggregate),
    reading: buildProfileReadingData(aggregate),
    genres: buildProfileGenres(aggregate),
    authors: buildProfileAuthors(aggregate),
    languages: buildProfileLanguages(aggregate),
    downloads: buildProfileDownloadsData(aggregate),
    account: buildProfileAccountData(aggregate),
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default useReaderProfile;
