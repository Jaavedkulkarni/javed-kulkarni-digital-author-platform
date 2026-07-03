import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthChangeEvent, User } from '@supabase/supabase-js';
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
import { getCachedProfile, getCachedRoles, setCachedRoles, clearRoleCache } from '../lib/roleCache';
import { fetchUserProfile, fetchUserRoles } from '../lib/roleService';
import type { Permission, SystemRole, UserProfile } from '../types/roles';

interface RoleContextType {
  roles: SystemRole[];
  primaryRole: SystemRole | null;
  profile: UserProfile | null;
  /** True only before the first auth snapshot resolves. */
  loading: boolean;
  /** Background refresh — must not block CMS UI. */
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
  resolveNavRole: (isReaderAuthenticated: boolean) => ReturnType<typeof resolveNavRoleFromRoles>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const PASSIVE_AUTH_EVENTS = new Set<AuthChangeEvent>(['TOKEN_REFRESHED']);

async function loadRolesForUser(user: User): Promise<{ roles: SystemRole[]; profile: UserProfile | null }> {
  const [dbRoles, profile] = await Promise.all([
    fetchUserRoles(user.id),
    fetchUserProfile(user.id),
  ]);
  const legacyRoles = resolveLegacyRolesFromUser(user);
  const roles = mergeRoles(dbRoles, legacyRoles);
  setCachedRoles(user.id, roles, profile);
  return { roles, profile };
}

function immediateRolesForUser(user: User | null): SystemRole[] {
  if (!user) return [];
  const cached = getCachedRoles(user.id);
  const legacy = resolveLegacyRolesFromUser(user);
  return mergeRoles(cached ?? [], legacy);
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refreshRoles = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const next = await loadRolesForUser(user);
      setRoles(next.roles);
      setProfile(next.profile);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const syncUser = async (nextUser: User | null, event?: AuthChangeEvent) => {
      if (cancelled) return;

      if (!nextUser) {
        clearRoleCache();
        setUser(null);
        setRoles([]);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (nextUser && legacyAdminMetadataNeedsRepair(nextUser) && event !== 'TOKEN_REFRESHED') {
        await supabase.auth.updateUser({ data: { role: 'admin' } });
      }

      setUser(nextUser);
      setRoles(immediateRolesForUser(nextUser));
      setProfile(getCachedProfile(nextUser.id));
      setLoading(false);

      if (event && PASSIVE_AUTH_EVENTS.has(event)) {
        return;
      }

      setRefreshing(true);
      try {
        const next = await loadRolesForUser(nextUser);
        if (cancelled) return;
        setRoles(next.roles);
        setProfile(next.profile);
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user ?? null, 'INITIAL_SESSION').catch(console.error);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      syncUser(session?.user ?? null, event).catch(console.error);
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
      resolveNavRole: (isReaderAuthenticated: boolean) => resolveNavRoleFromRoles(roles, isReaderAuthenticated),
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
