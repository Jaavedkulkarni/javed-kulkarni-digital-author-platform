import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createProfileRepository } from './profileRepository';
import { createRoleRepository } from './roleRepository';
import { createUserRoleRepository } from './userRoleRepository';
import { createOrganizationRepository } from './organizationRepository';
import { createOrganizationInvitationRepository } from './organizationInvitationRepository';
import { createAuditLogRepository } from './auditLogRepository';

export function createOrganizationRepositories(client: TypedSupabaseClient) {
  return {
    profiles: createProfileRepository(client),
    roles: createRoleRepository(client),
    userRoles: createUserRoleRepository(client),
    organizations: createOrganizationRepository(),
    invitations: createOrganizationInvitationRepository(),
    auditLogs: createAuditLogRepository(),
  };
}

export type OrganizationRepositories = ReturnType<typeof createOrganizationRepositories>;
