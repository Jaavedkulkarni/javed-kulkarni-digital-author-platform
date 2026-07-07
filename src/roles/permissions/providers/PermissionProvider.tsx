import { useContext, useCallback, useMemo, type ReactNode } from 'react';
import { useCurrentUserRoles, useRoleManagementContext } from '../../hooks/useCurrentUserRoles';
import type { RolePermission } from '../../types/permission.types';
import type { PermissionService } from '../../services/permissionService';
import { PermissionContext } from '../contexts/PermissionContext';
import type { PermissionContextValue } from '../types/guard.types';
import { createPermissionChecker } from '../utils/permissionChecker';
import {
  getCachedPermissions,
  invalidatePermissionCache,
  setCachedPermissions,
} from '../stores/permissionCacheStore';
import { runPermissionMatrixValidation } from '../validation/permissionMatrixValidation';

let matrixValidated = false;

function ensureMatrixValidated() {
  if (!matrixValidated) {
    runPermissionMatrixValidation();
    matrixValidated = true;
  }
}

export function PermissionProvider({ children }: { children: ReactNode }) {
  ensureMatrixValidated();
  const { services, userId, refreshRoles } = useRoleManagementContext();
  const { roles, isLoading, isFetching } = useCurrentUserRoles();
  const service: PermissionService = services.permissions;
  const isAuthenticated = Boolean(userId);

  const permissions = useMemo(() => {
    if (!userId) return new Set<RolePermission>();

    const cached = getCachedPermissions(userId);
    if (cached && cached.roles.join(',') === roles.join(',')) {
      return new Set<RolePermission>(cached.permissions);
    }

    const next = service.collectPermissions(roles);
    setCachedPermissions(userId, roles, next);
    return next;
  }, [userId, roles, service]);

  const refreshPermissions = useCallback(async () => {
    if (userId) invalidatePermissionCache(userId);
    await refreshRoles();
  }, [userId, refreshRoles]);

  const value = useMemo<PermissionContextValue>(() => {
    const checker = createPermissionChecker(service, roles);
    return {
      roles,
      permissions,
      userId,
      isAuthenticated,
      isLoading,
      isFetching,
      service,
      refreshPermissions,
      ...checker,
    };
  }, [roles, permissions, userId, isAuthenticated, isLoading, isFetching, service, refreshPermissions]);

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissionContext(): PermissionContextValue {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within PermissionProvider');
  }
  return context;
}
