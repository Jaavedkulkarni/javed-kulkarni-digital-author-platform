import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createCmsServices } from '../../cms/services';
import { createOrganizationRepositories } from '../repositories';
import { createOrganizationService } from './organizationService';
import { createWorkspaceService } from './workspaceService';
import { createRoleService } from './roleService';
import { createPermissionService } from './permissionService';
import { createInvitationService } from './invitationService';
import { createVerificationService } from './verificationService';
import { createAuditService } from './auditService';
import { createOnboardingService } from './onboardingService';

export interface OrganizationServices {
  organizations: ReturnType<typeof createOrganizationService>;
  workspace: ReturnType<typeof createWorkspaceService>;
  roles: ReturnType<typeof createRoleService>;
  permissions: ReturnType<typeof createPermissionService>;
  invitations: ReturnType<typeof createInvitationService>;
  verification: ReturnType<typeof createVerificationService>;
  audit: ReturnType<typeof createAuditService>;
  onboarding: ReturnType<typeof createOnboardingService>;
}

export function createOrganizationServices(client: TypedSupabaseClient): OrganizationServices {
  const repos = createOrganizationRepositories(client);
  const cms = createCmsServices(client);
  const roles = createRoleService(repos.profiles, repos.roles, repos.userRoles, repos.auditLogs);
  const verification = createVerificationService(repos.auditLogs);

  return {
    organizations: createOrganizationService(repos.organizations),
    workspace: createWorkspaceService(repos.organizations, repos.auditLogs),
    roles,
    permissions: createPermissionService(),
    invitations: createInvitationService(repos.invitations, repos.auditLogs),
    verification,
    audit: createAuditService(repos.auditLogs),
    onboarding: createOnboardingService(roles, cms.authors, verification),
  };
}

export {
  createOrganizationService,
  createWorkspaceService,
  createRoleService,
  createPermissionService,
  createInvitationService,
  createVerificationService,
  createAuditService,
  createOnboardingService,
};