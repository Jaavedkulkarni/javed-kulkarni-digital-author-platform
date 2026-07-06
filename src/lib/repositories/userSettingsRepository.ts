import type { UserSettings, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class UserSettingsRepository extends BaseRepository<'user_settings'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'user_settings', { softDelete: true });
  }

  async findByUserId(userId: string): Promise<UserSettings | null> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async createSettings(payload: TablesInsert<'user_settings'>): Promise<UserSettings> {
    return this.create(payload);
  }

  async updateSettings(id: string, payload: TablesUpdate<'user_settings'>): Promise<UserSettings> {
    return this.update(id, payload);
  }

  async updateByUserId(userId: string, payload: TablesUpdate<'user_settings'>): Promise<UserSettings | null> {
    const existing = await this.findByUserId(userId);
    if (!existing) return null;
    return this.update(existing.id, payload);
  }
}

export function createUserSettingsRepository(client: TypedSupabaseClient): UserSettingsRepository {
  return new UserSettingsRepository(client);
}
