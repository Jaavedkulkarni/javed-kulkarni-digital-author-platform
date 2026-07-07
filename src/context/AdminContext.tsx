import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../auth/services/auth.service';
import { AdminView } from '../types/blog';
import { adminMetadataNeedsRepair } from '../lib/authRoles';
import { mergeRoles, resolveLegacyRolesFromUser, isStaff } from '../lib/permissions';
import { fetchUserRoles } from '../lib/roleService';

interface AdminContextType {
  isAuthenticated: boolean;
  session: any;
  user: any;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const syncSession = async (session: Session | null) => {
      let nextUser = session?.user ?? null;
      if (nextUser && adminMetadataNeedsRepair(nextUser)) {
        const { data, error } = await supabase.auth.updateUser({ data: { role: 'admin' } });
        if (!error && data.user) nextUser = data.user;
      }
      setSession(session);
      setUser(nextUser);
      setIsAuthenticated(!!session);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session).catch(console.error);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        return;
      }
      syncSession(session).catch(console.error);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.signInWithPassword({ email, password });
      if (!result.success) {
        return { success: false, error: result.error ?? 'Login failed.' };
      }

      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !authUser) {
        await authService.logout();
        return { success: false, error: 'Login failed.' };
      }

      const dbRoles = await fetchUserRoles(authUser.id);
      const roles = mergeRoles(dbRoles, resolveLegacyRolesFromUser(authUser));
      if (!isStaff(roles)) {
        await authService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        return { success: false, error: 'This account does not have staff access.' };
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setUser(authUser);
      setSession(currentSession);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        session,
        user,
        login,
        logout,
        currentView,
        setCurrentView,
        sidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
