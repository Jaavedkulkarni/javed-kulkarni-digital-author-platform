import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { Tables, TablesInsert } from '../../types/database';
import type { SystemRole } from '../../types/roles';
import type { UserRoleAssignment } from '../types/role.types';

interface RoleJoinRow {
  name: SystemRole;
}

export class UserRoleRepository extends BaseRepository<'user_roles'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'user_roles', { softDelete: false });
  }

  async findByUserId(userId: string): Promise<UserRoleAssignment[]> {
    const { data, error } = await this.client
      .from('user_roles')
      .select('user_id, role_id, assigned_at, assigned_by, roles(name)')
      .eq('user_id', userId);

    if (error) {
      console.warn('UserRoleRepository.findByUserId failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => ({
      userId: row.user_id,
      roleId: row.role_id,
      roleName: (row.roles as RoleJoinRow | null)?.name ?? 'reader',
      assignedAt: row.assigned_at,
      assignedBy: row.assigned_by,
    }));
  }

  async assignRole(payload: TablesInsert<'user_roles'>): Promise<boolean> {
    const { error } = await this.client.from('user_roles').upsert(
      {
        user_id: payload.user_id,
        role_id: payload.role_id,
        assigned_by: payload.assigned_by,
        assigned_at: payload.assigned_at ?? new Date().toISOString(),
      },
      { onConflict: 'user_id,role_id' },
    );
    if (error) {
      console.warn('UserRoleRepository.assignRole failed:', error.message);
      return false;
    }
    return true;
  }

  async removeRole(userId: string, roleId: string): Promise<boolean> {
    const { error } = await this.client
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);
    if (error) {
      console.warn('UserRoleRepository.removeRole failed:', error.message);
      return false;
    }
    return true;
  }

  async findAssignmentsForRole(roleId: string): Promise<Tables<'user_roles'>[]> {
    return this.findMany({
      filters: { conditions: [eq('role_id', roleId)], match: 'all' },
    });
  }
}

export function createUserRoleRepository(client: TypedSupabaseClient): UserRoleRepository {
  return new UserRoleRepository(client);
}
