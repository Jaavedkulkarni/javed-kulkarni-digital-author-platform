import { getBrowserClient } from '../../lib/supabase/clients/browser';
import type { Json, NotificationCategory } from '../../types/database';

export type NotificationChannel = 'email' | 'in_app' | 'push' | 'sms' | 'webhook';

export interface NotificationDispatchInput {
  userId: string;
  channel: NotificationChannel;
  category: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationEngine {
  send(input: NotificationDispatchInput): Promise<string | null>;
}

export class EnterpriseNotificationEngine implements NotificationEngine {
  async send(input: NotificationDispatchInput): Promise<string | null> {
    if (input.channel === 'in_app') {
      const client = getBrowserClient();
      const { data, error } = await client
        .from('notifications')
        .insert({
          user_id: input.userId,
          channel: input.channel,
          category: input.category as NotificationCategory,
          title: input.title,
          body: input.body,
          metadata: (input.metadata ?? {}) as Json,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data?.id ?? null;
    }

    return null;
  }
}

let engine: EnterpriseNotificationEngine | null = null;

export function getEnterpriseNotificationEngine(): EnterpriseNotificationEngine {
  if (!engine) engine = new EnterpriseNotificationEngine();
  return engine;
}
