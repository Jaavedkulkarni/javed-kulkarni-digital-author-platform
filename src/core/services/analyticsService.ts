import type { AnalyticsEventType, Json, TablesInsert } from '../../types/database';
import type { DatabaseService } from '../../lib/database/databaseService';
import { getGlobalErrorHandler } from './globalErrorHandler';
import { CORE_LOG_SCOPES } from '../constants/app.constants';

export interface TrackAnalyticsEventInput {
  userId?: string | null;
  eventType: AnalyticsEventType;
  eventName?: string | null;
  bookId?: string | null;
  chapterId?: string | null;
  pagePath?: string | null;
  properties?: Record<string, unknown>;
}

export interface AnalyticsService {
  track(input: TrackAnalyticsEventInput): Promise<void>;
}

export function createAnalyticsService(database: DatabaseService): AnalyticsService {
  return {
    async track(input) {
      try {
        const payload: TablesInsert<'analytics_events'> = {
          user_id: input.userId ?? null,
          event_type: input.eventType,
          event_name: input.eventName ?? null,
          book_id: input.bookId ?? null,
          chapter_id: input.chapterId ?? null,
          page_path: input.pagePath ?? null,
          properties: (input.properties ?? {}) as Json,
        };

        await database.create('analytics_events', payload);
      } catch (error) {
        getGlobalErrorHandler().handle(error, {
          scope: CORE_LOG_SCOPES.container,
          operation: 'analytics.track',
          metadata: { eventType: input.eventType },
        });
      }
    },
  };
}
