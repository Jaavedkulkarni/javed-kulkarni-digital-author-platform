import type { Tables } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { withRetry } from '../../lib/utils/retry';
import type { AnalyticsDateRange } from '../types/analytics.types';

export class AuthorAnalyticsRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findByBookIds(bookIds: string[], range?: AnalyticsDateRange): Promise<Tables<'analytics_events'>[]> {
    if (bookIds.length === 0) return [];

    return withRetry(async () => {
      let query = this.client
        .from('analytics_events')
        .select('*')
        .in('book_id', bookIds)
        .order('occurred_at', { ascending: false });

      if (range?.from) query = query.gte('occurred_at', range.from);
      if (range?.to) query = query.lte('occurred_at', range.to);

      const result = await query.limit(5000);
      if (result.error) throw result.error;
      return (result.data ?? []) as Tables<'analytics_events'>[];
    }, { scope: 'author.analytics.fetch' });
  }
}

export function createAuthorAnalyticsRepository(client: TypedSupabaseClient): AuthorAnalyticsRepository {
  return new AuthorAnalyticsRepository(client);
}
