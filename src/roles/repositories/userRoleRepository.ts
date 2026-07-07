import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { TablesInsert } from '../../types/database';
import type { SystemRole } from '../../types/roles';
import type { UserRoleAssignment } from '../types/role.types';

interface RoleJoinRow {
  name: SystemRole;
}

type UserRoleRow = {
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by: string | null;
  roles: RoleJoinRow | null;
};

function mapAssignment(row: UserRoleRow): UserRoleAssignment {
  const roleName = row.roles?.name ?? 'reader';
  return {
    id: `${row.user_id}:${row.role_id}`,
    userId: row.user_id,
    roleId: row.role_id,
    roleName,
    roleSlug: roleName,
    assignedAt: row.assigned_at,
    assignedBy: row.assigned_by,
    isActive: true,
    createdAt: row.assigned_at,
    updatedAt: row.assigned_at,
  };
}

export class UserRoleRepository extends BaseRepository<'user_roles'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'user_roles', { softDelete: false });
  }

  async findActiveByUserId(userId: string): Promise<UserRoleAssignment[]> {
    const { data, error } = await this.client
      .from('user_roles')
      .select('user_id, role_id, assigned_at, assigned_by, roles(name)')
      .eq('user_id', userId);

    if (error) {
      console.warn('UserRoleRepository.findActiveByUserId failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => mapAssignment(row as UserRoleRow));
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

  async deactivateRole(userId: string, roleId: string, _actorId: string): Promise<boolean> {
    const { error } = await this.client
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);

    if (error) {
      console.warn('UserRoleRepository.deactivateRole failed:', error.message);
      return false;
    }
    return true;
  }

  async findAssignmentsForRole(roleId: string): Promise<UserRoleAssignment[]> {
    const { data, error } = await this.client
      .from('user_roles')
      .select('user_id, role_id, assigned_at, assigned_by, roles(name)')
      .eq('role_id', roleId);

    if (error) {
      console.warn('UserRoleRepository.findAssignmentsForRole failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => mapAssignment(row as UserRoleRow));
  }

  async hasActiveRole(userId: string, roleId: string): Promise<boolean> {
    const rows = await this.findMany({
      filters: {
        conditions: [eq('user_id', userId), eq('role_id', roleId)],
        match: 'all',
      },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows.length > 0;
  }
}

export function createUserRoleRepository(client: TypedSupabaseClient): UserRoleRepository {
  return new UserRoleRepository(client);
}
