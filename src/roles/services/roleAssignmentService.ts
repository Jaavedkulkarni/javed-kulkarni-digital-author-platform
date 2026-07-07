import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import type { SystemRole } from '../../types/roles';
import type { RoleAssignmentRepository } from '../repositories/roleAssignmentRepository';
import type { UserRoleRepository } from '../repositories/userRoleRepository';
import type {
  AssignUserRoleInput,
  RemoveUserRoleInput,
  RoleAssignmentOutcome,
  RoleAssignmentValidationContext,
  RoleAssignmentValidationResult,
} from '../types/assignment.types';
import type { RoleOperationResult } from '../types/errors';
import { AuthenticationRequiredError } from '../types/errors';
import { ROLE_ASSIGNMENT_MESSAGES } from '../constants/assignment.constants';
import { invalidateUserRoleCache } from '../stores/roleCacheStore';
import type { RoleValidationService } from './roleValidationService';
import type { RoleAuditService } from './roleAuditService';

function mapRpcError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('insufficient permissions')) return ROLE_ASSIGNMENT_MESSAGES.INSUFFICIENT_PERMISSIONS;
  if (normalized.includes('already assigned')) return ROLE_ASSIGNMENT_MESSAGES.ALREADY_ASSIGNED;
  if (normalized.includes('not assigned')) return ROLE_ASSIGNMENT_MESSAGES.NOT_ASSIGNED;
  if (normalized.includes('reader cannot be removed')) return ROLE_ASSIGNMENT_MESSAGES.READER_CANNOT_REMOVE;
  if (normalized.includes('last active super admin')) return ROLE_ASSIGNMENT_MESSAGES.LAST_SUPER_ADMIN;
  if (normalized.includes('authentication required')) return ROLE_ASSIGNMENT_MESSAGES.AUTHENTICATION_REQUIRED;
  return ROLE_ASSIGNMENT_MESSAGES.UNEXPECTED_ERROR;
}

export class RoleAssignmentService {
  constructor(
    private readonly client: TypedSupabaseClient,
    private readonly assignmentRepo: RoleAssignmentRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly validation: RoleValidationService,
    private readonly audit: RoleAuditService
  ) {}

  private async requireAuthenticatedUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error || !user) throw new AuthenticationRequiredError();
    return user.id;
  }

  async getUserRoles(userId: string): Promise<SystemRole[]> {
    await this.requireAuthenticatedUserId();
    const assignments = await this.userRoleRepo.findActiveByUserId(userId);
    return assignments.map((assignment) => assignment.roleName);
  }

  getAssignableRoles(actorRoles: SystemRole[]): SystemRole[] {
    return this.validation.getAssignableRoles(actorRoles);
  }

  validateAssignment(context: RoleAssignmentValidationContext): RoleAssignmentValidationResult {
    return this.validation.validateAssignment(context);
  }

  async validateRemoval(context: RoleAssignmentValidationContext): Promise<RoleAssignmentValidationResult> {
    const activeSuperAdminCount = await this.assignmentRepo.countActiveSuperAdmins();
    return this.validation.validateRemoval(context, activeSuperAdminCount);
  }

  async assignUserRole(input: AssignUserRoleInput): Promise<RoleOperationResult<RoleAssignmentOutcome>> {
    try {
      const actorId = await this.requireAuthenticatedUserId();
      const [actorRoles, targetRoles] = await Promise.all([
        this.getUserRoles(actorId),
        this.getUserRoles(input.targetUserId),
      ]);

      const validation = this.validateAssignment({
        actorId,
        actorRoles,
        targetUserId: input.targetUserId,
        targetRoles,
        role: input.role,
      });

      if (!validation.valid) {
        return { success: false, errors: validation.errors };
      }

      const { logId } = await this.assignmentRepo.applyChange({
        targetUserId: input.targetUserId,
        roleName: input.role,
        action: 'assign',
        reason: input.reason,
      });

      invalidateUserRoleCache(input.targetUserId);
      const assignments = await this.userRoleRepo.findActiveByUserId(input.targetUserId);

      return {
        success: true,
        message: ROLE_ASSIGNMENT_MESSAGES.ASSIGNED_SUCCESS,
        data: {
          logId,
          targetUserId: input.targetUserId,
          role: input.role,
          assignments,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : ROLE_ASSIGNMENT_MESSAGES.UNEXPECTED_ERROR;
      return { success: false, errors: [mapRpcError(message)] };
    }
  }

  async removeUserRole(input: RemoveUserRoleInput): Promise<RoleOperationResult<RoleAssignmentOutcome>> {
    try {
      const actorId = await this.requireAuthenticatedUserId();
      const [actorRoles, targetRoles] = await Promise.all([
        this.getUserRoles(actorId),
        this.getUserRoles(input.targetUserId),
      ]);

      const validation = await this.validateRemoval({
        actorId,
        actorRoles,
        targetUserId: input.targetUserId,
        targetRoles,
        role: input.role,
      });

      if (!validation.valid) {
        return { success: false, errors: validation.errors };
      }

      const { logId } = await this.assignmentRepo.applyChange({
        targetUserId: input.targetUserId,
        roleName: input.role,
        action: 'remove',
        reason: input.reason,
      });

      invalidateUserRoleCache(input.targetUserId);
      const assignments = await this.userRoleRepo.findActiveByUserId(input.targetUserId);

      return {
        success: true,
        message: ROLE_ASSIGNMENT_MESSAGES.REMOVED_SUCCESS,
        data: {
          logId,
          targetUserId: input.targetUserId,
          role: input.role,
          assignments,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : ROLE_ASSIGNMENT_MESSAGES.UNEXPECTED_ERROR;
      return { success: false, errors: [mapRpcError(message)] };
    }
  }

  getAssignmentHistory(userId: string, limit = 50) {
    return this.audit.getAssignmentHistory(userId, limit);
  }
}

export function createRoleAssignmentService(
  client: TypedSupabaseClient,
  assignmentRepo: RoleAssignmentRepository,
  userRoleRepo: UserRoleRepository,
  validation: RoleValidationService,
  audit: RoleAuditService
): RoleAssignmentService {
  return new RoleAssignmentService(client, assignmentRepo, userRoleRepo, validation, audit);
}
