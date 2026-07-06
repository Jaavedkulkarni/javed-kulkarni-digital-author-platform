import type { ReaderProfile } from '../../types/reader';
import { formatMembershipPlanLabel } from '../../lib/membershipLogic';
import type {
  ProfileAccountData,
  ProfileAuthorItem,
  ProfileDownloadsData,
  ProfileGenreItem,
  ProfileHeroData,
  ProfileMembershipData,
  ProfilePersonalInfo,
  ProfileReadingData,
} from '../../components/profile/profileTypes';
import type { MockReadingRecord } from '../../data/mockReadingProgress';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';
import type { MockWishlistBook } from '../../data/mockWishlistBooks';
import type { MockMembershipRecord } from '../../data/mockMembership';
import type { DownloadCardItem } from '../../components/downloads/downloadTypes';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'R';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function formatReaderSince(date: string | null | undefined): string {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export interface ReaderProfileAggregateInput {
  profile: ReaderProfile | null;
  email: string | null;
  membership: MockMembershipRecord;
  library: MockLibraryBook[];
  wishlist: MockWishlistBook[];
  progress: MockReadingRecord[];
  downloads: DownloadCardItem[];
}

export function buildProfileHeroData(input: ReaderProfileAggregateInput): ProfileHeroData {
  const name = input.profile?.display_name ?? input.profile?.full_name ?? 'Reader';
  return {
    name,
    membershipLabel: input.membership.status === 'active' ? 'Premium Member' : 'Reader',
    readerSince: formatReaderSince(input.profile?.joined_at ?? input.profile?.created_at ?? null),
    bio: 'Avid reader on AuthorOS.',
    avatarInitials: initialsFromName(name),
  };
}

export function buildProfilePersonalInfo(input: ReaderProfileAggregateInput): ProfilePersonalInfo {
  const name = input.profile?.display_name ?? input.profile?.full_name ?? 'Reader';
  return {
    name,
    email: input.email ?? '—',
    phone: input.profile?.mobile ?? '—',
    country: '—',
    language: input.profile?.language ?? '—',
    timezone: '—',
  };
}

export function buildProfileMembershipData(input: ReaderProfileAggregateInput): ProfileMembershipData {
  return {
    currentPlan: formatMembershipPlanLabel(input.membership.currentPlanId),
    renewDate: input.membership.expiryDate ?? '—',
    status: input.membership.status === 'active' ? 'Active' : 'Inactive',
    benefits: ['Unlimited eBooks', 'Offline Downloads', 'Reading Insights'],
  };
}

export function buildProfileReadingData(input: ReaderProfileAggregateInput): ProfileReadingData {
  const completed = input.progress.filter((record) => record.status === 'completed').length;
  const reading = input.progress.filter((record) => record.status === 'reading').length;
  const hours = input.progress.reduce((sum, record) => sum + record.readingTimeMinutes, 0);

  return {
    booksRead: completed,
    booksReading: reading,
    wishlist: input.wishlist.length,
    downloads: input.downloads.length,
    hoursRead: `${Math.round(hours / 60)}h`,
    readingStreak: '—',
  };
}

export function buildProfileAuthors(input: ReaderProfileAggregateInput): ProfileAuthorItem[] {
  const authors = new Map<string, string>();
  for (const book of input.library) {
    if (!authors.has(book.author)) {
      authors.set(book.author, book.author);
    }
  }
  return [...authors.entries()].slice(0, 3).map(([name], index) => ({
    id: `author-${index}`,
    name,
  }));
}

export function buildProfileLanguages(input: ReaderProfileAggregateInput): string[] {
  const languages = new Set<string>();
  for (const book of input.library) {
    if (book.language) languages.add(book.language);
  }
  return [...languages].slice(0, 3);
}
export function buildProfileGenres(input: ReaderProfileAggregateInput): ProfileGenreItem[] {
  const counts = new Map<string, number>();
  for (const book of input.library) {
    counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label], index) => ({ id: `genre-${index}`, label }));
}

export function buildProfileDownloadsData(input: ReaderProfileAggregateInput): ProfileDownloadsData {
  return {
    downloadedBooks: input.downloads.length,
    offlineStorage: input.downloads[0]?.downloadSize ?? '0 MB',
    availableSpace: '—',
  };
}

export function buildProfileAccountData(input: ReaderProfileAggregateInput): ProfileAccountData {
  return {
    joinedDate: formatReaderSince(input.profile?.joined_at ?? input.profile?.created_at ?? null),
    lastLogin: formatReaderSince(input.profile?.last_login ?? null),
    accountStatus: input.profile?.membership_status ? 'Verified' : 'Pending',
    devices: 1,
  };
}
