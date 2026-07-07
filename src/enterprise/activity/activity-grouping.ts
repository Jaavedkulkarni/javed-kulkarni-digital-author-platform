export type ActivityTimeBucket = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days';

export type ActivityTimeGroupKey = ActivityTimeBucket | `month:${string}` | `year:${number}`;

export interface ActivityTimelineEvent {
  id: string;
  createdAt: string;
  title: string;
  description?: string | null;
  activityType?: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityTimeGroupSection {
  key: ActivityTimeGroupKey;
  label: string;
  events: ActivityTimelineEvent[];
}

export const ACTIVITY_TIME_BUCKET_ORDER: ActivityTimeBucket[] = [
  'today',
  'yesterday',
  'last_7_days',
  'last_30_days',
];

export const ACTIVITY_TIME_BUCKET_LABELS: Record<ActivityTimeBucket, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last_7_days: 'Last 7 Days',
  last_30_days: 'Last 30 Days',
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

export function resolveActivityTimeGroup(isoDate: string, now = new Date()): ActivityTimeGroupKey {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'last_30_days';

  const todayStart = startOfDay(now);
  const yesterdayStart = addDays(todayStart, -1);
  const last7Start = addDays(todayStart, -7);
  const last30Start = addDays(todayStart, -30);

  if (date >= todayStart) return 'today';
  if (date >= yesterdayStart) return 'yesterday';
  if (date >= last7Start) return 'last_7_days';
  if (date >= last30Start) return 'last_30_days';

  if (date.getFullYear() === now.getFullYear()) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `month:${date.getFullYear()}-${month}`;
  }

  return `year:${date.getFullYear()}`;
}

export function resolveActivityTimeGroupLabel(key: ActivityTimeGroupKey): string {
  if (key in ACTIVITY_TIME_BUCKET_LABELS) {
    return ACTIVITY_TIME_BUCKET_LABELS[key as ActivityTimeBucket];
  }
  if (key.startsWith('month:')) {
    const [, ym] = key.split(':');
    const [year, month] = ym.split('-').map(Number);
    return formatMonthLabel(year, month - 1);
  }
  if (key.startsWith('year:')) {
    return key.replace('year:', '');
  }
  return key;
}

function compareGroupKeys(a: ActivityTimeGroupKey, b: ActivityTimeGroupKey): number {
  const rank = (key: ActivityTimeGroupKey): number => {
    const bucketIndex = ACTIVITY_TIME_BUCKET_ORDER.indexOf(key as ActivityTimeBucket);
    if (bucketIndex >= 0) return bucketIndex;
    if (key.startsWith('month:')) return ACTIVITY_TIME_BUCKET_ORDER.length + 1;
    if (key.startsWith('year:')) return ACTIVITY_TIME_BUCKET_ORDER.length + 2;
    return 999;
  };

  const rankDiff = rank(a) - rank(b);
  if (rankDiff !== 0) return rankDiff;

  if (a.startsWith('month:') && b.startsWith('month:')) {
    return b.localeCompare(a);
  }
  if (a.startsWith('year:') && b.startsWith('year:')) {
    return Number(b.replace('year:', '')) - Number(a.replace('year:', ''));
  }

  return 0;
}

export function groupActivityEventsByTime(
  events: ActivityTimelineEvent[],
  now = new Date(),
): ActivityTimeGroupSection[] {
  const buckets = new Map<ActivityTimeGroupKey, ActivityTimelineEvent[]>();

  for (const event of events) {
    const key = resolveActivityTimeGroup(event.createdAt, now);
    const list = buckets.get(key) ?? [];
    list.push(event);
    buckets.set(key, list);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => compareGroupKeys(a, b))
    .map(([key, groupedEvents]) => ({
      key,
      label: resolveActivityTimeGroupLabel(key),
      events: groupedEvents.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }));
}

export function formatActivityEventTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const DEFAULT_COLLAPSED_ACTIVITY_GROUPS: ActivityTimeGroupKey[] = [
  'last_7_days',
  'last_30_days',
];
