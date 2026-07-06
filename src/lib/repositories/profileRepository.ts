import type { Profile, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class ProfileRepository extends BaseRepository<'profiles'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'profiles', { softDelete: true });
  }

  async findByEmail(email: string): Promise<Profile | null> {
    return this.findMany({
      filters: { conditions: [eq('email', email)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async createProfile(payload: TablesInsert<'profiles'>): Promise<Profile> {
    return this.create(payload);
  }

  async updateProfile(id: string, payload: TablesUpdate<'profiles'>): Promise<Profile> {
    return this.update(id, payload);
  }
}

export function createProfileRepository(client: TypedSupabaseClient): ProfileRepository {
  return new ProfileRepository(client);
}
