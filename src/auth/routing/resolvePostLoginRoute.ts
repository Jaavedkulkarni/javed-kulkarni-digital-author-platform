import type { SystemRole } from '../../types/roles';

import { getHighestPriorityRole } from '../../roles/constants/role-priority';

import type { AuthBootstrapPayload } from '../bootstrap/auth-bootstrap.types';



const EFFECTIVE_ROLE_ROUTES: Partial<Record<SystemRole, string>> = {

  super_admin: '/super',

  admin: '/platform-admin',

  author: '/author',

  publisher: '/publisher',

  reader: '/reader',

};



/** Map highest effective role (Role Registry priority) to dashboard route. */

export function resolvePostLoginRouteFromEffectiveRoles(effectiveRoles: SystemRole[]): string {

  const highestRole = getHighestPriorityRole(effectiveRoles);

  if (!highestRole) return '/';

  return EFFECTIVE_ROLE_ROUTES[highestRole] ?? '/';

}



/**

 * Single post-login redirect resolver.

 * Waits for bootstrap refresh once and reuses the resolved payload.

 */

export async function resolvePostLoginRoute(
  refreshBootstrap: () => Promise<AuthBootstrapPayload | null>,
): Promise<string> {
  const payload = await refreshBootstrap();
  console.log('[8] REDIRECT resolvePostLoginRoute', { hasPayload: Boolean(payload) });
  if (!payload) return '/';
  return resolvePostLoginRouteFromEffectiveRoles(payload.effectiveRoles);
}

