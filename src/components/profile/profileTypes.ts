export interface ProfileHeroData {
  name: string;
  membershipLabel: string;
  readerSince: string;
  bio: string;
  avatarInitials: string;
}

export interface ProfilePersonalInfo {
  name: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  timezone: string;
}

export interface ProfileMembershipData {
  currentPlan: string;
  renewDate: string;
  status: string;
  benefits: string[];
}

export interface ProfileReadingData {
  booksRead: number;
  booksReading: number;
  wishlist: number;
  downloads: number;
  hoursRead: string;
  readingStreak: string;
}

export interface ProfileGenreItem {
  id: string;
  label: string;
}

export interface ProfileAuthorItem {
  id: string;
  name: string;
}

export interface ProfileGoalItem {
  id: string;
  label: string;
  ringPercent: number;
  current: number;
  target: number;
  unit: string;
}

export interface ProfileDownloadsData {
  downloadedBooks: number;
  offlineStorage: string;
  availableSpace: string;
}

export interface ProfileAccountData {
  joinedDate: string;
  lastLogin: string;
  accountStatus: string;
  devices: number;
}

export const PROFILE_HERO_PLACEHOLDER: ProfileHeroData = {
  name: 'Rajesh Patil',
  membershipLabel: 'Premium Member',
  readerSince: 'January 2024',
  bio: 'Marathi literature enthusiast exploring parenting, digital life, and contemporary fiction.',
  avatarInitials: 'RP',
};

export const PROFILE_PERSONAL_PLACEHOLDER: ProfilePersonalInfo = {
  name: 'Rajesh Patil',
  email: 'rajesh.patil@example.com',
  phone: '+91 98765 43210',
  country: 'India',
  language: 'Marathi',
  timezone: 'Asia/Kolkata (UTC+5:30)',
};

export const PROFILE_MEMBERSHIP_PLACEHOLDER: ProfileMembershipData = {
  currentPlan: 'Premium Annual',
  renewDate: '15 Jan 2027',
  status: 'Active',
  benefits: ['Unlimited eBooks', 'Offline Downloads', 'Exclusive Author Content', 'Reading Insights'],
};

export const PROFILE_READING_PLACEHOLDER: ProfileReadingData = {
  booksRead: 24,
  booksReading: 3,
  wishlist: 8,
  downloads: 12,
  hoursRead: '268h',
  readingStreak: '5 days',
};

export const PROFILE_GENRES_PLACEHOLDER: ProfileGenreItem[] = [
  { id: 'parenting', label: 'Parenting' },
  { id: 'digital-life', label: 'Digital Life' },
  { id: 'fiction', label: 'Fiction' },
  { id: 'self-help', label: 'Self Help' },
];

export const PROFILE_AUTHORS_PLACEHOLDER: ProfileAuthorItem[] = [
  { id: 'javed', name: 'जावेद कुलकर्णी' },
  { id: 'pu-la', name: 'पु. ल. देशपांडे' },
  { id: 'vijay', name: 'विजय तेंडुलकर' },
];

export const PROFILE_LANGUAGES_PLACEHOLDER: string[] = ['Marathi', 'English', 'Hindi'];

export const PROFILE_GOALS_PLACEHOLDER: ProfileGoalItem[] = [
  { id: 'monthly', label: 'Monthly Goal', ringPercent: 72, current: 3, target: 4, unit: 'books' },
  { id: 'yearly', label: 'Yearly Goal', ringPercent: 58, current: 7, target: 12, unit: 'books' },
];

export const PROFILE_DOWNLOADS_PLACEHOLDER: ProfileDownloadsData = {
  downloadedBooks: 12,
  offlineStorage: '1.8 GB',
  availableSpace: '6.2 GB',
};

export const PROFILE_ACCOUNT_PLACEHOLDER: ProfileAccountData = {
  joinedDate: '12 Jan 2024',
  lastLogin: '5 Jul 2026, 9:30 AM',
  accountStatus: 'Verified',
  devices: 2,
};

export const PROFILE_ACTIONS = [
  'Edit Profile',
  'Change Password',
  'Manage Membership',
  'Export Reading Data',
] as const;

export const MEMBERSHIP_BADGE_STYLE =
  'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300';

export const ACCOUNT_STATUS_STYLE =
  'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300';

export const GENRE_CARD_STYLE =
  'flex h-full min-h-[4.5rem] items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center text-sm font-medium text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300';

export const AUTHOR_CARD_STYLE =
  'flex h-full min-h-[4.5rem] items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-center text-sm font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300';

export const LANGUAGE_BADGE_STYLE =
  'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300';
