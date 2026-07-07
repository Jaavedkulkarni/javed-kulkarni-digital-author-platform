import type { SystemRole } from '../../types/roles';
import { resolvePostLoginRouteFromEffectiveRoles } from '../../auth/routing/resolvePostLoginRoute';
import type { PublicAuthIntent } from './publicAuthIntent';

/** @deprecated Use resolvePostLoginRoute from auth/routing */
export function resolvePublicAuthDashboardPath(
  effectiveRoles: SystemRole[],
  intent: PublicAuthIntent | null = null,
): string {
  if (intent === 'become-author') {
    const path = resolvePostLoginRouteFromEffectiveRoles(effectiveRoles);
    if (path === '/author') return path;
  }

  return resolvePostLoginRouteFromEffectiveRoles(effectiveRoles);
}
