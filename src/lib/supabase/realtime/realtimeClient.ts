import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '../clients/browser';
import type { TableName } from '../../../types/database';
import { REALTIME_EVENTS } from '../config/constants';
import { logger } from '../../utils/logger';

export type RealtimeChangePayload<T extends Record<string, unknown>> =
  RealtimePostgresChangesPayload<T>;

export interface RealtimeSubscriptionOptions<T extends Record<string, unknown>> {
  table: TableName;
  schema?: string;
  event?: (typeof REALTIME_EVENTS)[number] | '*';
  filter?: string;
  onInsert?: (payload: RealtimeChangePayload<T>) => void;
  onUpdate?: (payload: RealtimeChangePayload<T>) => void;
  onDelete?: (payload: RealtimeChangePayload<T>) => void;
  onChange?: (payload: RealtimeChangePayload<T>) => void;
}

export class RealtimeClient {
  constructor(private readonly client: TypedSupabaseClient) {}

  subscribe<T extends Record<string, unknown>>(
    channelName: string,
    options: RealtimeSubscriptionOptions<T>
  ): RealtimeChannel {
    const schema = options.schema ?? 'public';
    const event = options.event ?? '*';

    const filter = {
      event,
      schema,
      table: options.table,
      filter: options.filter,
    } as const;

    const channel = this.client
      .channel(channelName)
      .on('postgres_changes', filter, (payload) => {
        const typedPayload = payload as RealtimeChangePayload<T>;
        options.onChange?.(typedPayload);

        if (payload.eventType === 'INSERT') options.onInsert?.(typedPayload);
        if (payload.eventType === 'UPDATE') options.onUpdate?.(typedPayload);
        if (payload.eventType === 'DELETE') options.onDelete?.(typedPayload);
      })
      .subscribe((status) => {
        logger.debug('realtime', `Channel "${channelName}" status: ${status}`);
      });

    return channel;
  }

  unsubscribe(channel: RealtimeChannel): void {
    void this.client.removeChannel(channel);
  }

  removeAllChannels(): void {
    void this.client.removeAllChannels();
  }
}

export function createRealtimeClient(client: TypedSupabaseClient): RealtimeClient {
  return new RealtimeClient(client);
}
