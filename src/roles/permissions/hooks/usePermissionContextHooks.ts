import { useMemo } from 'react';
import type { RolePermission } from '../../types/permission.types';
import { usePermissionContext } from '../providers/PermissionProvider';

/** Context adapter used by permission guards and permission UI components. */
export function usePermissionContextState() {
  return usePermissionContext();
}

/** @deprecated Use usePermissionContext() — retained for internal permission components. */
export function usePermissions() {
  return usePermissionContext();
}

export function usePermission(permission: RolePermission) {
  const ctx = usePermissionContext();
  return useMemo(
    () => ({
      allowed: ctx.hasPermission(permission),
      loading: ctx.isLoading,
      isAuthenticated: ctx.isAuthenticated,
    }),
    [ctx, permission],
  );
}

export function useCan() {
  const ctx = usePermissionContext();
  return useMemo(
    () => ({
      can: ctx.can,
      cannot: ctx.cannot,
      canView: ctx.canView,
      canCreate: ctx.canCreate,
      canEdit: ctx.canEdit,
      canDelete: ctx.canDelete,
      canApprove: ctx.canApprove,
      canReject: ctx.canReject,
      canPublish: ctx.canPublish,
      canExport: ctx.canExport,
      canImport: ctx.canImport,
      canManage: ctx.canManage,
      hasPermission: ctx.hasPermission,
      hasAnyPermission: ctx.hasAnyPermission,
      hasAllPermissions: ctx.hasAllPermissions,
      isLoading: ctx.isLoading,
      isAuthenticated: ctx.isAuthenticated,
    }),
    [ctx],
  );
}

export function useRole() {
  const ctx = usePermissionContext();
  return useMemo(() => {
    const primary =
      ctx.roles.find((role) => role === 'super_admin') ??
      ctx.roles.find((role) => role === 'admin') ??
      ctx.roles.find((role) => role === 'author') ??
      ctx.roles.find((role) => role === 'publisher') ??
      ctx.roles.find((role) => role === 'reader') ??
      null;
    return {
      role: primary,
      isLoading: ctx.isLoading,
    };
  }, [ctx.roles, ctx.isLoading]);
}

export function usePermissionRoles() {
  const ctx = usePermissionContext();
  return useMemo(
    () => ({
      roles: ctx.roles,
      permissions: ctx.permissions,
      isLoading: ctx.isLoading,
      isFetching: ctx.isFetching,
      refreshPermissions: ctx.refreshPermissions,
    }),
    [ctx.roles, ctx.permissions, ctx.isLoading, ctx.isFetching, ctx.refreshPermissions],
  );
}
