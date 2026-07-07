import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import type { SystemRole } from '../../types/roles';
import { ROLE_ASSIGNMENT_MESSAGES } from '../constants/assignment.constants';

export interface ApplyUserRoleChangeInput {
  targetUserId: string;
  roleName: SystemRole;
  action: 'assign' | 'remove';
  reason?: string | null;
}

export class RoleAssignmentRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async applyChange(input: ApplyUserRoleChangeInput): Promise<{ logId: string }> {
    const { data, error } = await this.client.rpc('apply_user_role_change', {
      p_target_user_id: input.targetUserId,
      p_role_name: input.roleName,
      p_action: input.action,
      p_reason: input.reason ?? null,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error(ROLE_ASSIGNMENT_MESSAGES.UNEXPECTED_ERROR);
    }

    return { logId: String(data) };
  }

  async countActiveSuperAdmins(): Promise<number> {
    const { data, error } = await this.client.rpc('count_active_super_admins');
    if (error) {
      console.warn('RoleAssignmentRepository.countActiveSuperAdmins failed:', error.message);
      return 0;
    }
    return typeof data === 'number' ? data : Number(data ?? 0);
  }
}

export function createRoleAssignmentRepository(client: TypedSupabaseClient): RoleAssignmentRepository {
  return new RoleAssignmentRepository(client);
}
