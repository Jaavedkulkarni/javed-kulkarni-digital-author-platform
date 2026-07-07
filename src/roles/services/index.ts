import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createRoleRepositories } from '../repositories';
import { createRoleService, RoleService } from './roleService';
import { createPermissionService, PermissionService, PermissionAuthorizationError } from './permissionService';
import { createRoleValidationService, RoleValidationService } from './roleValidationService';
import { createRoleAuditService, RoleAuditService } from './roleAuditService';
import { createRoleAssignmentService, RoleAssignmentService } from './roleAssignmentService';

export interface RoleManagementServices {
  roles: RoleService;
  permissions: PermissionService;
  validation: RoleValidationService;
  audit: RoleAuditService;
  assignments: RoleAssignmentService;
}

export function createRoleManagementServices(client: TypedSupabaseClient): RoleManagementServices {
  const repos = createRoleRepositories(client);
  const validation = createRoleValidationService();
  const audit = createRoleAuditService(repos.assignmentLogs, repos.roles);

  return {
    roles: createRoleService(client, repos.roles, repos.userRoles),
    permissions: createPermissionService(),
    validation,
    audit,
    assignments: createRoleAssignmentService(
      client,
      repos.assignments,
      repos.userRoles,
      validation,
      audit
    ),
  };
}

export {
  RoleService,
  createRoleService,
} from './roleService';

export {
  PermissionService,
  PermissionAuthorizationError,
  createPermissionService,
} from './permissionService';

export {
  RoleValidationService,
  createRoleValidationService,
} from './roleValidationService';

export {
  RoleAuditService,
  createRoleAuditService,
} from './roleAuditService';

export {
  RoleAssignmentService,
  createRoleAssignmentService,
} from './roleAssignmentService';

export {
  RoleRegistryService,
  roleRegistryService,
  createRoleRegistryService,
} from './role-registry.service';

export {
  RoleResolver,
  createRoleResolver,
  collectInheritedRoles,
} from './role-resolver.service';

export {
  RoleValidator,
  roleValidator,
  createRoleValidator,
} from './role-validator.service';
