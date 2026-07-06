import type { ProfileRepository } from '../repositories/profileRepository';
import type { RoleRepository } from '../repositories/roleRepository';
import type { UserRoleRepository } from '../repositories/userRoleRepository';
import type { IAuditLogRepository } from '../repositories/auditLogRepository';
import type { SystemRole } from '../../types/roles';
import type { UserRoleAssignment, UserRoleContext } from '../types/role.types';
import type { OrganizationOperationResult } from '../types/common';
import type { AuthRole } from '../../auth/types/roles.types';
import { mapSystemRolesToAuthRoles } from '../utils/roleMapping';
import { isSuperAdmin as checkSuperAdmin } from '../../lib/permissions';

export class RoleService {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly roleRepo: RoleRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly auditRepo: IAuditLogRepository
  ) {}

  async getProfile(userId: string) {
    return this.profileRepo.findByUserId(userId);
  }

  async getUserRoles(userId: string): Promise<SystemRole[]> {
    const assignments = await this.userRoleRepo.findByUserId(userId);
    return assignments.map((a) => a.roleName as SystemRole);
  }

  async getUserRoleAssignments(userId: string): Promise<UserRoleAssignment[]> {
    return this.userRoleRepo.findByUserId(userId);
  }

  async listRoles() {
    return this.roleRepo.listAll();
  }

  buildRoleContext(systemRoles: SystemRole[], extraAuthRoles: AuthRole[] = []): UserRoleContext {
    const authRoles = [...new Set([...mapSystemRolesToAuthRoles(systemRoles), ...extraAuthRoles])];
    if (extraAuthRoles.includes('publisher') && !authRoles.includes('publisher')) {
      authRoles.push('publisher');
    }
    return {
      systemRoles,
      authRoles,
      hasSuperAdmin: checkSuperAdmin(systemRoles),
      hasPlatformAdmin: systemRoles.includes('admin') || checkSuperAdmin(systemRoles),
      isReader: true,
    };
  }

  async assignRole(
    userId: string,
    roleName: SystemRole,
    assignedBy: string
  ): Promise<OrganizationOperationResult> {
    const role = await this.roleRepo.findByName(roleName);
    if (!role) return { success: false, errors: [`Role "${roleName}" not found.`] };
    const ok = await this.userRoleRepo.assignRole({
      user_id: userId,
      role_id: role.id,
      assigned_by: assignedBy,
    });
    if (!ok) return { success: false, errors: ['Failed to assign role.'] };
    await this.auditRepo.append({
      eventType: 'role_assignment',
      actorId: assignedBy,
      targetId: userId,
      metadata: { role: roleName },
    });
    return { success: true };
  }

  async removeRole(
    userId: string,
    roleName: SystemRole,
    actorId: string
  ): Promise<OrganizationOperationResult> {
    const role = await this.roleRepo.findByName(roleName);
    if (!role) return { success: false, errors: [`Role "${roleName}" not found.`] };
    const ok = await this.userRoleRepo.removeRole(userId, role.id);
    if (!ok) return { success: false, errors: ['Failed to remove role.'] };
    await this.auditRepo.append({
      eventType: 'role_assignment',
      actorId,
      targetId: userId,
      metadata: { role: roleName, action: 'removed' },
    });
    return { success: true };
  }
}

export function createRoleService(
  profileRepo: ProfileRepository,
  roleRepo: RoleRepository,
  userRoleRepo: UserRoleRepository,
  auditRepo: IAuditLogRepository
): RoleService {
  return new RoleService(profileRepo, roleRepo, userRoleRepo, auditRepo);
}
