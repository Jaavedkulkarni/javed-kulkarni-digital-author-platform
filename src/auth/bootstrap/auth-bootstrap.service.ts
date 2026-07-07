import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import {
  legacyAdminMetadataNeedsRepair,
  mergeRoles,
  resolveLegacyRolesFromUser,
} from '../../lib/permissions';
import { fetchUserProfile } from '../../lib/roleService';
import { buildFullNavigation } from '../../navigation';
import { DEFAULT_SYSTEM_ROLE } from '../../roles/constants/role.constants';
import { createPermissionResolver } from '../../roles/permissions/services/permission-resolver.service';
import { createRoleResolver } from '../../roles/services/role-resolver.service';
import type { SystemRole } from '../../types/roles';
import type { AuthBootstrapError, AuthBootstrapPayload } from './auth-bootstrap.types';
import { createBootstrapError } from './auth-bootstrap.types';

interface RoleRow {
  name: SystemRole;
}

export class AuthBootstrapService {
  async loadCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw createBootstrapError('authentication_failed', error.message);
    }

    return user;
  }

  private async loadAssignedRoles(user: User): Promise<SystemRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id);

    if (error) {
      throw createBootstrapError('role_loading_failed', error.message);
    }

    const dbRoles = (data ?? [])
      .map((row) => (row.roles as RoleRow | null)?.name)
      .filter((role): role is SystemRole => Boolean(role));

    const legacyRoles = resolveLegacyRolesFromUser(user);
    const assignedRoles = mergeRoles(dbRoles, legacyRoles);

    return assignedRoles.length > 0 ? assignedRoles : [DEFAULT_SYSTEM_ROLE];
  }

  async bootstrap(user: User): Promise<AuthBootstrapPayload> {
    if (!user) {
      throw createBootstrapError('authentication_failed', 'No authenticated user.');
    }

    if (legacyAdminMetadataNeedsRepair(user)) {
      await supabase.auth.updateUser({ data: { role: 'admin' } });
    }

    let profile = null;
    try {
      profile = await fetchUserProfile(user.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile loading failed.';
      throw createBootstrapError('authentication_failed', message);
    }

    let assignedRoles: SystemRole[];
    try {
      assignedRoles = await this.loadAssignedRoles(user);
    } catch (error) {
      if (this.isBootstrapError(error)) throw error;
      const message = error instanceof Error ? error.message : 'Role loading failed.';
      throw createBootstrapError('role_loading_failed', message);
    }

    let effectiveRoles: SystemRole[];
    try {
      effectiveRoles = createRoleResolver(assignedRoles).getEffectiveRoles();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Role resolution failed.';
      throw createBootstrapError('role_loading_failed', message);
    }

    let permissions: string[];
    try {
      permissions = createPermissionResolver(assignedRoles).getEffectivePermissions();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Permission resolution failed.';
      throw createBootstrapError('permission_loading_failed', message);
    }

    let navigation;
    try {
      navigation = buildFullNavigation({
        roles: assignedRoles,
        permissions,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Navigation build failed.';
      throw createBootstrapError('navigation_loading_failed', message);
    }

    return {
      user,
      profile,
      assignedRoles,
      effectiveRoles,
      permissions,
      navigation,
    };
  }

  async bootstrapFromSession(): Promise<AuthBootstrapPayload | null> {
    const user = await this.loadCurrentUser();
    if (!user) return null;
    return this.bootstrap(user);
  }

  private isBootstrapError(error: unknown): error is AuthBootstrapError {
    return Boolean(
      error &&
        typeof error === 'object' &&
        'code' in error &&
        'message' in error,
    );
  }
}

export const authBootstrapService = new AuthBootstrapService();

export function createAuthBootstrapService(): AuthBootstrapService {
  return authBootstrapService;
}
