import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import type { RolePermission } from '../types/permission.types';
import {
  PermissionAuthorizationError,
  PermissionService,
  createPermissionService,
} from '../services/permissionService';
import type { SystemRole } from '../../types/roles';

export async function loadActorPermissions(
  client: TypedSupabaseClient
): Promise<{ userId: string; roles: SystemRole[] }> {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    throw new PermissionAuthorizationError(401, 'Authentication required.');
  }

  const { data, error: rolesError } = await client
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id);

  if (rolesError) {
    throw new PermissionAuthorizationError(403, 'Unable to verify permissions.');
  }

  const roles = (data ?? [])
    .map((row) => (row.roles as { name: SystemRole } | null)?.name)
    .filter((role): role is SystemRole => Boolean(role));

  return { userId: user.id, roles: roles.length > 0 ? roles : ['reader'] };
}

export async function assertServerPermission(
  client: TypedSupabaseClient,
  permission: RolePermission,
  service: PermissionService = createPermissionService()
): Promise<{ userId: string; roles: SystemRole[] }> {
  const actor = await loadActorPermissions(client, service);
  service.assertPermission(actor.roles, permission, true);
  return actor;
}

export async function assertServerAnyPermission(
  client: TypedSupabaseClient,
  permissions: RolePermission[],
  service: PermissionService = createPermissionService()
): Promise<{ userId: string; roles: SystemRole[] }> {
  const actor = await loadActorPermissions(client, service);
  service.assertAnyPermission(actor.roles, permissions, true);
  return actor;
}

export { PermissionAuthorizationError };
