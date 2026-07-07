import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import type { SystemRole } from '../../types/roles';
import type { RoleAssignmentLog, RoleAssignmentAction } from '../types/assignment.types';
import type { TablesInsert } from '../../types/database';

interface RoleJoinRow {
  name: SystemRole;
}

function mapLogRow(
  row: {
    id: string;
    user_id: string;
    role_id: string;
    action: string;
    assigned_by: string | null;
    reason: string | null;
    created_at: string;
    roles: RoleJoinRow | null;
  }
): RoleAssignmentLog {
  return {
    id: row.id,
    userId: row.user_id,
    roleId: row.role_id,
    roleName: row.roles?.name ?? 'reader',
    action: row.action as RoleAssignmentAction,
    assignedBy: row.assigned_by,
    reason: row.reason,
    createdAt: row.created_at,
  };
}

export class RoleAssignmentLogRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findByUserId(userId: string, limit = 50): Promise<RoleAssignmentLog[]> {
    const { data, error } = await this.client
      .from('role_assignment_logs')
      .select('id, user_id, role_id, action, assigned_by, reason, created_at, roles(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('RoleAssignmentLogRepository.findByUserId failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => mapLogRow(row as Parameters<typeof mapLogRow>[0]));
  }

  async insertLog(payload: TablesInsert<'role_assignment_logs'>): Promise<RoleAssignmentLog | null> {
    const { data, error } = await this.client
      .from('role_assignment_logs')
      .insert(payload)
      .select('id, user_id, role_id, action, assigned_by, reason, created_at, roles(name)')
      .single();

    if (error || !data) {
      console.warn('RoleAssignmentLogRepository.insertLog failed:', error?.message);
      return null;
    }

    return mapLogRow(data as Parameters<typeof mapLogRow>[0]);
  }
}

export function createRoleAssignmentLogRepository(client: TypedSupabaseClient): RoleAssignmentLogRepository {
  return new RoleAssignmentLogRepository(client);
}
