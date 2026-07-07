export { resolvePostLoginRoute, resolvePostLoginRouteFromEffectiveRoles } from '../routing/resolvePostLoginRoute';

/** @deprecated Use resolvePostLoginRoute(refreshBootstrap) */
export async function resolveAuthPostLoginPath(
  refreshBootstrap: () => Promise<void>,
): Promise<string> {
  return resolvePostLoginRoute(refreshBootstrap);
}
