import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
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
  legacyAdminMetadataNeedsRepair,
  mergeRoles,
  resolveLegacyRolesFromUser,
  resolveNavRoleFromRoles,
} from '../lib/permissions';
import { fetchUserProfile, fetchUserRoles } from '../lib/roleService';
import type { Permission, SystemRole, UserProfile } from '../types/roles';

interface RoleContextType {
  roles: SystemRole[];
  primaryRole: SystemRole | null;
  profile: UserProfile | null;
  loading: boolean;
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
  resolveNavRole: (isReaderAuthenticated: boolean) => ReturnType<typeof resolveNavRoleFromRoles>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

async function loadRolesForUser(user: User | null): Promise<{ roles: SystemRole[]; profile: UserProfile | null }> {
  if (!user) return { roles: [], profile: null };

  const [dbRoles, profile] = await Promise.all([
    fetchUserRoles(user.id),
    fetchUserProfile(user.id),
  ]);

  const legacyRoles = resolveLegacyRolesFromUser(user);
  const roles = mergeRoles(dbRoles, legacyRoles);

  return { roles, profile };
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRoles = useCallback(async () => {
    if (!user) {
      setRoles([]);
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const next = await loadRolesForUser(user);
    setRoles(next.roles);
    setProfile(next.profile);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const syncUser = async (nextUser: User | null) => {
      setUser(nextUser);
      setLoading(true);

      if (nextUser && legacyAdminMetadataNeedsRepair(nextUser)) {
        await supabase.auth.updateUser({ data: { role: 'admin' } });
      }

      const next = await loadRolesForUser(nextUser);
      if (cancelled) return;
      setRoles(next.roles);
      setProfile(next.profile);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user ?? null).catch(console.error);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null).catch(console.error);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<RoleContextType>(() => {
    const primaryRole = getPrimaryRole(roles);

    return {
      roles,
      primaryRole,
      profile,
      loading,
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
      resolveNavRole: (isReaderAuthenticated: boolean) => resolveNavRoleFromRoles(roles, isReaderAuthenticated),
    };
  }, [roles, profile, loading, refreshRoles]);

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
