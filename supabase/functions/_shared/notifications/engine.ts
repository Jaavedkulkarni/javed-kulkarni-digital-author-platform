import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Logger } from '../logging/logger.ts';
import { enqueueJob } from '../jobs/queue.ts';

export type NotificationChannel = 'email' | 'in_app' | 'push' | 'sms' | 'webhook';

export interface NotificationPayload {
  userId: string;
  channel: NotificationChannel;
  category: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export async function sendNotification(
  adminClient: SupabaseClient,
  payload: NotificationPayload,
  logger: Logger,
): Promise<string | null> {
  if (payload.channel === 'in_app') {
    const { data, error } = await adminClient
      .from('notifications')
      .insert({
        user_id: payload.userId,
        channel: payload.channel,
        category: payload.category,
        title: payload.title,
        body: payload.body,
        metadata: payload.metadata ?? {},
      })
      .select('id')
      .single();

    if (error) {
      logger.error('In-app notification failed', { message: error.message });
      return null;
    }
    return data?.id ?? null;
  }

  if (payload.channel === 'email') {
    return enqueueJob(
      adminClient,
      {
        jobType: 'email',
        payload: {
          userId: payload.userId,
          category: payload.category,
          title: payload.title,
          body: payload.body,
          metadata: payload.metadata ?? {},
        },
      },
      logger,
    );
  }

  if (payload.channel === 'push' || payload.channel === 'sms' || payload.channel === 'webhook') {
    return enqueueJob(
      adminClient,
      {
        jobType: 'notification',
        payload: { ...payload },
      },
      logger,
    );
  }

  return null;
}
