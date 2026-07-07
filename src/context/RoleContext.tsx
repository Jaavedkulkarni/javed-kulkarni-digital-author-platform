import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import {
  canManageBlog,
  canManageBooks,
  canManageMedia,
  canManageProducts,
  canManageReaders,
  canManageSettings,
  canManageUsers,
  canManageWebsite,
  collectPermissions,
  getPrimaryRole,
  hasPermission,
  isAdmin,
  isAuthor,
  isReader,
  isStaff,
  isSuperAdmin,
  resolveNavRoleFromRoles,
} from '../lib/permissions';
import { useBootstrap } from '../auth/bootstrap/hooks';
import type { Permission, SystemRole, UserProfile } from '../types/roles';

interface RoleContextType {
  roles: SystemRole[];
  primaryRole: SystemRole | null;
  profile: UserProfile | null;
  /** True only before bootstrap resolves for the current session. */
  loading: boolean;
  /** Background bootstrap revalidation. */
  refreshing: boolean;
  refreshRoles: () => Promise<void>;
  isSuperAdmin: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
  isReader: boolean;
  isStaff: boolean;
  hasPermission: (permission: Permission) => boolean;
  canManageBooks: boolean;
  canManageBlog: boolean;
  canManageUsers: boolean;
  canManageWebsite: boolean;
  canManageSettings: boolean;
  canManageProducts: boolean;
  canManageMedia: boolean;
  canManageReaders: boolean;
  resolveNavRole: () => ReturnType<typeof resolveNavRoleFromRoles>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const bootstrap = useBootstrap();

  const roles = bootstrap.user ? bootstrap.assignedRoles : [];
  const profile = bootstrap.profile;
  const loading = Boolean(bootstrap.user && !bootstrap.isReady && bootstrap.loading);
  const refreshing = Boolean(bootstrap.user && bootstrap.isReady && bootstrap.loading);

  const refreshRoles = useCallback(async () => {
    await bootstrap.refresh();
  }, [bootstrap]);

  const value = useMemo<RoleContextType>(() => {
    const primaryRole = getPrimaryRole(roles);

    return {
      roles,
      primaryRole,
      profile,
      loading,
      refreshing,
      refreshRoles,
      isSuperAdmin: isSuperAdmin(roles),
      isAuthor: isAuthor(roles),
      isAdmin: isAdmin(roles),
      isReader: isReader(roles),
      isStaff: isStaff(roles),
      hasPermission: (permission: Permission) => hasPermission(roles, permission),
      canManageBooks: canManageBooks(roles),
      canManageBlog: canManageBlog(roles),
      canManageUsers: canManageUsers(roles),
      canManageWebsite: canManageWebsite(roles),
      canManageSettings: canManageSettings(roles),
      canManageProducts: canManageProducts(roles),
      canManageMedia: canManageMedia(roles),
      canManageReaders: canManageReaders(roles),
      resolveNavRole: () => resolveNavRoleFromRoles(roles),
    };
  }, [roles, profile, loading, refreshing, refreshRoles]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoles must be used within a RoleProvider');
  }
  return context;
}

export function useRolePermissions() {
  const context = useRoles();
  return {
    roles: context.roles,
    permissions: collectPermissions(context.roles),
    primaryRole: context.primaryRole,
  };
}

export default RoleProvider;
