import { useContext, useMemo } from 'react';
import { AuthBootstrapContext } from './AuthBootstrapContext';

function useAuthBootstrapContext() {
  const context = useContext(AuthBootstrapContext);
  if (!context) {
    throw new Error('Auth bootstrap hooks must be used within AuthBootstrapProvider.');
  }
  return context;
}

/** Full authentication bootstrap state for the current session. */
export function useBootstrap() {
  return useAuthBootstrapContext();
}

/** Current authenticated user and profile from bootstrap. */
export function useCurrentUser() {
  const ctx = useAuthBootstrapContext();
  return useMemo(
    () => ({
      user: ctx.user,
      profile: ctx.profile,
      isLoading: ctx.loading,
      isReady: ctx.isReady,
      error: ctx.error,
    }),
    [ctx.user, ctx.profile, ctx.loading, ctx.isReady, ctx.error],
  );
}

/** Effective roles resolved through the Role Registry. */
export function useEffectiveRoles() {
  const ctx = useAuthBootstrapContext();
  return useMemo(
    () => ({
      assignedRoles: ctx.assignedRoles,
      effectiveRoles: ctx.effectiveRoles,
      isLoading: ctx.loading,
      isReady: ctx.isReady,
      error: ctx.error,
    }),
    [ctx.assignedRoles, ctx.effectiveRoles, ctx.loading, ctx.isReady, ctx.error],
  );
}

/** Effective permissions resolved through the Permission Registry. */
export function useEffectivePermissions() {
  const ctx = useAuthBootstrapContext();
  return useMemo(
    () => ({
      permissions: ctx.permissions,
      isLoading: ctx.loading,
      isReady: ctx.isReady,
      error: ctx.error,
    }),
    [ctx.permissions, ctx.loading, ctx.isReady, ctx.error],
  );
}

/** Navigation built by the Navigation Builder for the current session. */
export function useNavigationState() {
  const ctx = useAuthBootstrapContext();
  return useMemo(
    () => ({
      navigation: ctx.navigation,
      items: ctx.navigation?.items ?? [],
      groups: ctx.navigation?.groups ?? [],
      isLoading: ctx.loading,
      isReady: ctx.isReady,
      error: ctx.error,
    }),
    [ctx.navigation, ctx.loading, ctx.isReady, ctx.error],
  );
}

export { useAuthBootstrapContext };
