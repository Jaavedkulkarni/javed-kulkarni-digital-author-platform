import type { Notification, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class NotificationRepository extends BaseRepository<'notifications'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'notifications', { softDelete: true });
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.findMany({
      filters: {
        conditions: [eq('user_id', userId), eq('is_read', false), eq('is_archived', false)],
        match: 'all',
      },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async createNotification(payload: TablesInsert<'notifications'>): Promise<Notification> {
    return this.create(payload);
  }

  async updateNotification(id: string, payload: TablesUpdate<'notifications'>): Promise<Notification> {
    return this.update(id, payload);
  }
}

export function createNotificationRepository(client: TypedSupabaseClient): NotificationRepository {
  return new NotificationRepository(client);
}
