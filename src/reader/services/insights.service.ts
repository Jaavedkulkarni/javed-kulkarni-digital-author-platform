import type { MockReadingRecord } from '../../data/mockReadingProgress';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';

export interface ReadingInsightsData {
  analytics: { label: string; value: string }[];
  readingTime: { label: string; value: string }[];
  streak: { label: string; value: string }[];
  goals: {
    id: string;
    label: string;
    current: number;
    target: number;
    unit: string;
    ringPercent: number;
  }[];
}

function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function buildReadingInsights(
  progress: MockReadingRecord[],
  library: MockLibraryBook[]
): ReadingInsightsData {
  const completed = progress.filter((record) => record.status === 'completed');
  const totalMinutes = progress.reduce((sum, record) => sum + record.readingTimeMinutes, 0);
  const totalPages = progress.reduce((sum, record) => sum + record.currentPage, 0);
  const avgProgress =
    progress.length > 0
      ? Math.round(progress.reduce((sum, record) => sum + record.progressPercent, 0) / progress.length)
      : 0;

  const categories = new Map<string, number>();
  for (const record of progress) {
    categories.set(record.category, (categories.get(record.category) ?? 0) + 1);
  }
  const favoriteCategory = [...categories.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const languages = new Map<string, number>();
  for (const book of library) {
    languages.set(book.language, (languages.get(book.language) ?? 0) + 1);
  }
  const favoriteLanguage = [...languages.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return {
    analytics: [
      { label: 'Books This Week', value: String(Math.min(completed.length, 4)) },
      { label: 'Books This Month', value: String(completed.length) },
      { label: 'Pages Read', value: String(totalPages) },
      { label: 'Average Progress', value: `${avgProgress}%` },
      { label: 'Average Session', value: formatMinutes(Math.round(totalMinutes / Math.max(progress.length, 1))) },
      { label: 'Favorite Category', value: favoriteCategory },
      { label: 'Favorite Language', value: favoriteLanguage },
    ],
    readingTime: [
      { label: 'Today', value: formatMinutes(Math.round(totalMinutes / 30)) },
      { label: 'This Week', value: formatMinutes(Math.round(totalMinutes / 4)) },
      { label: 'This Month', value: formatMinutes(totalMinutes) },
      { label: 'Lifetime', value: formatMinutes(totalMinutes) },
      { label: 'Average Daily', value: formatMinutes(Math.round(totalMinutes / 30)) },
      { label: 'Longest Session', value: formatMinutes(Math.max(...progress.map((r) => r.averageSessionMinutes), 0)) },
    ],
    streak: [
      { label: 'Current Streak', value: '—' },
      { label: 'Longest Streak', value: '—' },
      { label: 'Consistency Score', value: '—' },
    ],
    goals: [
      {
        id: 'monthly',
        label: 'Monthly Goal',
        current: completed.length,
        target: 4,
        unit: 'books',
        ringPercent: Math.min(100, Math.round((completed.length / 4) * 100)),
      },
      {
        id: 'weekly',
        label: 'Weekly Goal',
        current: Math.min(completed.length, 3),
        target: 3,
        unit: 'sessions',
        ringPercent: Math.min(100, Math.round((Math.min(completed.length, 3) / 3) * 100)),
      },
    ],
  };
}
