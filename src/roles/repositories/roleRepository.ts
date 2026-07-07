import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { SystemRole } from '../../types/roles';
import type { RoleRecord } from '../types/role.types';

type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

function mapRoleRow(row: RoleRow): RoleRecord {
  const name = row.name as SystemRole;
  return {
    id: row.id,
    name,
    slug: name,
    description: row.description,
    isSystem: true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class RoleRepository extends BaseRepository<'roles'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'roles', { softDelete: false });
  }

  async findRoleById(id: string): Promise<RoleRecord | null> {
    const row = await super.findById(id);
    return row ? mapRoleRow(row as RoleRow) : null;
  }

  async findByName(name: SystemRole): Promise<RoleRecord | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('name', name)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ? mapRoleRow(rows[0] as RoleRow) : null;
  }

  /** Slug mirrors role name in the current schema (no roles.slug column). */
  async findBySlug(slug: string): Promise<RoleRecord | null> {
    return this.findByName(slug as SystemRole);
  }

  async listSystemRoles(): Promise<RoleRecord[]> {
    return this.listAll();
  }

  async listAll(): Promise<RoleRecord[]> {
    const rows = await this.findMany({ sort: { sortBy: 'name', sortDirection: 'asc' } });
    return rows.map((row) => mapRoleRow(row as RoleRow));
  }
}

export function createRoleRepository(client: TypedSupabaseClient): RoleRepository {
  return new RoleRepository(client);
}
