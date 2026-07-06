import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class ReaderMembershipRepository extends BaseRepository<'memberships'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'memberships', { softDelete: true });
  }

  async findActiveByUser(userId: string): Promise<Tables<'memberships'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async upsertMembership(payload: TablesInsert<'memberships'>): Promise<Tables<'memberships'>> {
    const existing = await this.findActiveByUser(payload.user_id);
    if (existing) {
      return this.update(existing.id, payload as TablesUpdate<'memberships'>);
    }
    return this.create(payload);
  }
}

export function createReaderMembershipRepository(client: TypedSupabaseClient): ReaderMembershipRepository {
  return new ReaderMembershipRepository(client);
}
