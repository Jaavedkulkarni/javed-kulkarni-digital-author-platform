import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { Tables } from '../../types/database';
import type { SystemRole } from '../../types/roles';

export class RoleRepository extends BaseRepository<'roles'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'roles', { softDelete: false });
  }

  async findByName(name: SystemRole): Promise<Tables<'roles'> | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('name', name)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async listAll(): Promise<Tables<'roles'>[]> {
    return this.findMany({ sort: { sortBy: 'name', sortDirection: 'asc' } });
  }
}

export function createRoleRepository(client: TypedSupabaseClient): RoleRepository {
  return new RoleRepository(client);
}
