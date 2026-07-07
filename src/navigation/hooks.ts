import { useMemo } from 'react';
import { useRoles, useRolePermissions } from '../context/RoleContext';
import { buildNavigation, buildNavigationGroups, navigationBuilder } from './builder';
import type { BuiltNavigation, NavigationBuildContext, NavigationGroup, NavigationItem } from './types';

function useNavigationContext(): NavigationBuildContext {
  const { roles } = useRoles();
  const { permissions } = useRolePermissions();
  return useMemo(
    () => ({
      roles,
      permissions,
    }),
    [roles, permissions],
  );
}

/** Resolves the full dynamic navigation tree for the current user. */
export function useNavigation(): BuiltNavigation & { loading: boolean } {
  const ctx = useNavigationContext();
  const { loading } = useRoles();

  return useMemo(
    () => ({
      ...navigationBuilder.build(ctx),
      loading,
    }),
    [ctx, loading],
  );
}

/** Resolves grouped navigation sections for the current user. */
export function useNavigationGroups(): { groups: NavigationGroup[]; loading: boolean } {
  const ctx = useNavigationContext();
  const { loading } = useRoles();

  return useMemo(
    () => ({
      groups: buildNavigationGroups(ctx),
      loading,
    }),
    [ctx, loading],
  );
}

/** Resolves flat navigation items for the current user. */
export function useNavigationItems(): { items: NavigationItem[]; loading: boolean } {
  const ctx = useNavigationContext();
  const { loading } = useRoles();

  return useMemo(
    () => ({
      items: buildNavigation(ctx),
      loading,
    }),
    [ctx, loading],
  );
}
