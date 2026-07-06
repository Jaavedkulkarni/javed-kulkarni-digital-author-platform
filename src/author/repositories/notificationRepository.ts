import type { Notification } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class AuthorNotificationRepository extends BaseRepository<'notifications'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'notifications', { softDelete: true });
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async countUnread(userId: string): Promise<number> {
    const rows = await this.findMany({
      filters: {
        conditions: [eq('user_id', userId), eq('is_read', false)],
        match: 'all',
      },
    });
    return rows.length;
  }

  async markRead(id: string): Promise<Notification> {
    return this.update(id, { is_read: true });
  }
}

export function createAuthorNotificationRepository(client: TypedSupabaseClient): AuthorNotificationRepository {
  return new AuthorNotificationRepository(client);
}
