import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createRoleRepository, RoleRepository } from './roleRepository';
import { createUserRoleRepository, UserRoleRepository } from './userRoleRepository';
import { createRoleAssignmentLogRepository, RoleAssignmentLogRepository } from './roleAssignmentLogRepository';
import { createRoleAssignmentRepository, RoleAssignmentRepository } from './roleAssignmentRepository';

export interface RoleRepositories {
  roles: RoleRepository;
  userRoles: UserRoleRepository;
  assignmentLogs: RoleAssignmentLogRepository;
  assignments: RoleAssignmentRepository;
}

export function createRoleRepositories(client: TypedSupabaseClient): RoleRepositories {
  return {
    roles: createRoleRepository(client),
    userRoles: createUserRoleRepository(client),
    assignmentLogs: createRoleAssignmentLogRepository(client),
    assignments: createRoleAssignmentRepository(client),
  };
}

export {
  RoleRepository,
  UserRoleRepository,
  RoleAssignmentLogRepository,
  RoleAssignmentRepository,
  createRoleRepository,
  createUserRoleRepository,
  createRoleAssignmentLogRepository,
  createRoleAssignmentRepository,
};
