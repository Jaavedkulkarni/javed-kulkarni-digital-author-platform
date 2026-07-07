import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import type { SystemRole } from '../../types/roles';
import type { RoleRepository } from '../repositories/roleRepository';
import type { UserRoleRepository } from '../repositories/userRoleRepository';
import type {
  AssignRoleInput,
  CurrentUserRoleSnapshot,
  RemoveRoleInput,
  RoleRecord,
  UserRoleAssignment,
} from '../types/role.types';
import type { RoleOperationResult } from '../types/errors';
import { AuthenticationRequiredError, RoleAssignmentError } from '../types/errors';
import {
  getCachedUserRoles,
  invalidateUserRoleCache,
  setCachedUserRoles,
} from '../stores/roleCacheStore';
import { DEFAULT_SYSTEM_ROLE } from '../constants/role.constants';
import {
  isAuthor as checkAuthor,
  isPlatformAdmin as checkPlatformAdmin,
  isPublisher as checkPublisher,
  isReader as checkReader,
  isSuperAdmin as checkSuperAdmin,
} from '../../lib/permissions';

export class RoleService {
  constructor(
    private readonly client: TypedSupabaseClient,
    private readonly roleRepo: RoleRepository,
    private readonly userRoleRepo: UserRoleRepository
  ) {}

  private async requireAuthenticatedUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error || !user) {
      throw new AuthenticationRequiredError();
    }
    return user.id;
  }

  async getUserRoleAssignments(userId: string): Promise<UserRoleAssignment[]> {
    return this.userRoleRepo.findActiveByUserId(userId);
  }

  async getUserRoles(userId: string): Promise<SystemRole[]> {
    const assignments = await this.getUserRoleAssignments(userId);
    const roles = assignments.map((assignment) => assignment.roleName);
    return roles.length > 0 ? roles : [DEFAULT_SYSTEM_ROLE];
  }

  async getCurrentUserRoles(useCache = true): Promise<CurrentUserRoleSnapshot> {
    const userId = await this.requireAuthenticatedUserId();

    if (useCache) {
      const cached = getCachedUserRoles(userId);
      if (cached) return cached;
    }

    const assignments = await this.getUserRoleAssignments(userId);
    const roles = assignments.map((a) => a.roleName);
    const normalizedRoles = roles.length > 0 ? roles : [DEFAULT_SYSTEM_ROLE];

    const snapshot: CurrentUserRoleSnapshot = {
      userId,
      roles: normalizedRoles,
      assignments,
      loadedAt: new Date().toISOString(),
    };

    setCachedUserRoles(snapshot);
    return snapshot;
  }

  hasRole(roles: SystemRole[], role: SystemRole): boolean {
    return roles.includes(role);
  }

  hasAnyRole(roles: SystemRole[], required: SystemRole[]): boolean {
    return required.some((role) => roles.includes(role));
  }

  hasAllRoles(roles: SystemRole[], required: SystemRole[]): boolean {
    return required.every((role) => roles.includes(role));
  }

  isReader(roles: SystemRole[]): boolean {
    return checkReader(roles);
  }

  isAuthor(roles: SystemRole[]): boolean {
    return checkAuthor(roles);
  }

  isPublisher(roles: SystemRole[]): boolean {
    return checkPublisher(roles);
  }

  isPlatformAdmin(roles: SystemRole[]): boolean {
    return checkPlatformAdmin(roles);
  }

  isSuperAdmin(roles: SystemRole[]): boolean {
    return checkSuperAdmin(roles);
  }

  async assignRole(input: AssignRoleInput): Promise<RoleOperationResult<UserRoleAssignment[]>> {
    const actorId = await this.requireAuthenticatedUserId();
    if (input.assignedBy !== actorId && !checkSuperAdmin(await this.getUserRoles(actorId))) {
      return { success: false, errors: ['Only super admins can assign roles on behalf of others.'] };
    }

    const role = await this.roleRepo.findByName(input.role);
    if (!role) {
      return { success: false, errors: [`Role "${input.role}" not found.`] };
    }

    const ok = await this.userRoleRepo.assignRole({
      user_id: input.userId,
      role_id: role.id,
      assigned_by: input.assignedBy,
    });

    if (!ok) {
      throw new RoleAssignmentError('Failed to assign role.');
    }

    invalidateUserRoleCache(input.userId);
    const assignments = await this.getUserRoleAssignments(input.userId);
    return { success: true, data: assignments };
  }

  async removeRole(input: RemoveRoleInput): Promise<RoleOperationResult<UserRoleAssignment[]>> {
    const actorId = await this.requireAuthenticatedUserId();
    if (input.actorId !== actorId && !checkSuperAdmin(await this.getUserRoles(actorId))) {
      return { success: false, errors: ['Only super admins can remove roles on behalf of others.'] };
    }

    if (input.role === DEFAULT_SYSTEM_ROLE) {
      return { success: false, errors: ['Reader role cannot be removed.'] };
    }

    const role = await this.roleRepo.findByName(input.role);
    if (!role) {
      return { success: false, errors: [`Role "${input.role}" not found.`] };
    }

    const ok = await this.userRoleRepo.deactivateRole(input.userId, role.id, input.actorId);
    if (!ok) {
      throw new RoleAssignmentError('Failed to remove role.');
    }

    invalidateUserRoleCache(input.userId);
    const assignments = await this.getUserRoleAssignments(input.userId);
    return { success: true, data: assignments };
  }

  async listSystemRoles(): Promise<RoleRecord[]> {
    await this.requireAuthenticatedUserId();
    return this.roleRepo.listSystemRoles();
  }

  invalidateCache(userId?: string): void {
    invalidateUserRoleCache(userId);
  }
}

export function createRoleService(
  client: TypedSupabaseClient,
  roleRepo: RoleRepository,
  userRoleRepo: UserRoleRepository
): RoleService {
  return new RoleService(client, roleRepo, userRoleRepo);
}
