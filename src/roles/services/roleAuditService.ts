import type { RoleAssignmentLogRepository } from '../repositories/roleAssignmentLogRepository';
import type { RoleRepository } from '../repositories/roleRepository';
import type { RoleAssignmentLog } from '../types/assignment.types';
import type { SystemRole } from '../../types/roles';
import type { TablesInsert } from '../../types/database';

export interface LogRoleAssignmentInput {
  targetUserId: string;
  role: SystemRole;
  assignedBy: string;
  reason?: string | null;
}

export class RoleAuditService {
  constructor(
    private readonly logRepo: RoleAssignmentLogRepository,
    private readonly roleRepo: RoleRepository
  ) {}

  async getAssignmentHistory(userId: string, limit = 50): Promise<RoleAssignmentLog[]> {
    return this.logRepo.findByUserId(userId, limit);
  }

  async logAssignment(input: LogRoleAssignmentInput): Promise<RoleAssignmentLog | null> {
    const role = await this.roleRepo.findByName(input.role);
    if (!role) return null;

    const payload: TablesInsert<'role_assignment_logs'> = {
      user_id: input.targetUserId,
      role_id: role.id,
      action: 'assigned',
      assigned_by: input.assignedBy,
      reason: input.reason ?? null,
    };

    return this.logRepo.insertLog(payload);
  }

  async logRemoval(input: LogRoleAssignmentInput): Promise<RoleAssignmentLog | null> {
    const role = await this.roleRepo.findByName(input.role);
    if (!role) return null;

    const payload: TablesInsert<'role_assignment_logs'> = {
      user_id: input.targetUserId,
      role_id: role.id,
      action: 'removed',
      assigned_by: input.assignedBy,
      reason: input.reason ?? null,
    };

    return this.logRepo.insertLog(payload);
  }
}

export function createRoleAuditService(
  logRepo: RoleAssignmentLogRepository,
  roleRepo: RoleRepository
): RoleAuditService {
  return new RoleAuditService(logRepo, roleRepo);
}
