export type ReadingInsightsTabKey =
  | 'progress'
  | 'analytics'
  | 'reading-time'
  | 'streak'
  | 'goals'
  | 'achievements';

export interface ReadingInsightsTab {
  id: ReadingInsightsTabKey;
  label: string;
}

export const READING_INSIGHTS_TABS: ReadingInsightsTab[] = [
  { id: 'progress', label: 'Progress' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reading-time', label: 'Reading Time' },
  { id: 'streak', label: 'Streak' },
  { id: 'goals', label: 'Goals' },
  { id: 'achievements', label: 'Achievements' },
];

export const ANALYTICS_MOCK = [
  { label: 'Books This Week', value: '4' },
  { label: 'Books This Month', value: '12' },
  { label: 'Pages Read', value: '845' },
  { label: 'Average Progress', value: '62%' },
  { label: 'Average Session', value: '48 min' },
  { label: 'Favorite Category', value: 'Parenting' },
  { label: 'Favorite Language', value: 'Marathi' },
] as const;

export const READING_TIME_MOCK = [
  { label: 'Today', value: '42 min' },
  { label: 'This Week', value: '5h 18m' },
  { label: 'This Month', value: '21h 35m' },
  { label: 'Lifetime', value: '268h' },
  { label: 'Average Daily', value: '48 min' },
  { label: 'Longest Session', value: '3h 12m' },
] as const;

export const STREAK_MOCK = [
  { label: 'Current Streak', value: '5 days' },
  { label: 'Longest Streak', value: '18 days' },
  { label: 'Consistency Score', value: '78%' },
] as const;

export interface ReadingGoalPlaceholder {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  ringPercent: number;
}

export const GOALS_MOCK: ReadingGoalPlaceholder[] = [
  { id: 'monthly', label: 'Monthly Goal', current: 3, target: 4, unit: 'books', ringPercent: 72 },
  { id: 'weekly', label: 'Weekly Goal', current: 1, target: 3, unit: 'sessions', ringPercent: 41 },
  { id: 'pages', label: 'Pages Goal', current: 290, target: 500, unit: 'pages', ringPercent: 58 },
  { id: 'books', label: 'Books Goal', current: 3, target: 10, unit: 'books', ringPercent: 30 },
];

export type AchievementStatus = 'locked' | 'unlocked';

export interface AchievementPlaceholder {
  id: string;
  title: string;
  description: string;
  status: AchievementStatus;
}

export const ACHIEVEMENTS_PLACEHOLDER: AchievementPlaceholder[] = [
  { id: 'first-book', title: 'First Book', description: 'Complete your first book.', status: 'unlocked' },
  { id: 'ten-books', title: '10 Books', description: 'Finish 10 books.', status: 'locked' },
  { id: 'fifty-books', title: '50 Books', description: 'Finish 50 books.', status: 'locked' },
  { id: 'hundred-hours', title: '100 Hours', description: 'Read for 100 hours total.', status: 'locked' },
  { id: 'thirty-day-streak', title: '30 Day Streak', description: 'Read every day for 30 days.', status: 'locked' },
  { id: 'premium-reader', title: 'Premium Reader', description: 'Unlock with membership.', status: 'locked' },
  { id: 'completion-master', title: 'Completion Master', description: 'Complete 25 books in a year.', status: 'locked' },
];
