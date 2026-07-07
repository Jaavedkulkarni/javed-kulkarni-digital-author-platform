import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../auth/services/auth.service';
import { isReader } from '../lib/permissions';
import { fetchUserRoles } from '../lib/roleService';
import {
  ensureReaderProfile,
  fetchReaderProfile,
  touchReaderLastLogin,
} from '../lib/readerService';
import type { ReaderProfile, ReaderSignupData } from '../types/reader';
import type { SystemRole } from '../types/roles';

interface ReaderContextType {
  session: Session | null;
  user: User | null;
  profile: ReaderProfile | null;
  isReaderAuthenticated: boolean;
  loading: boolean;
  signUp: (data: ReaderSignupData) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ReaderProfile | null>(null);
  const [userRoles, setUserRoles] = useState<SystemRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (authUser: User | null, roles: SystemRole[]) => {
    if (!authUser || !isReader(roles)) {
      setProfile(null);
      return;
    }
    try {
      let p = await fetchReaderProfile(authUser.id);
      if (!p) {
        p = await ensureReaderProfile(authUser.id, {
          full_name: authUser.user_metadata?.full_name,
          display_name: authUser.user_metadata?.display_name,
        });
      }
      setProfile(p);
    } catch (err) {
      console.error('Failed to load reader profile:', err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrateReader = async (authUser: User) => {
      const roles = await fetchUserRoles(authUser.id);
      if (cancelled) return;
      setUserRoles(roles);
      await loadProfile(authUser, roles);
    };

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return;
      const authUser = s?.user ?? null;
      setSession(s);
      setUser(authUser);
      setLoading(false);
      if (authUser) {
        void hydrateReader(authUser);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (event === 'TOKEN_REFRESHED') {
        setSession(s);
        return;
      }

      const authUser = s?.user ?? null;
      setSession(s);
      setUser(authUser);

      if (!authUser) {
        setProfile(null);
        setUserRoles([]);
        return;
      }

      await hydrateReader(authUser);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const isReaderAuthenticated = !!session && !!user && isReader(userRoles);

  const signUp = async (data: ReaderSignupData) => {
    try {
      const result = await authService.register(
        {
          email: data.email,
          password: data.password,
          confirmPassword: data.password,
          fullName: data.full_name,
        },
        {
          emailRedirectTo: `${SITE_URL}/reader/verify-email`,
          userMetadata: {
            role: 'reader',
            full_name: data.full_name,
            display_name: data.display_name || data.full_name,
          },
        },
      );
      if (!result.success) return { success: false, error: result.error };
      return { success: true, needsVerification: result.needsVerification ?? false };
    } catch {
      return { success: false, error: 'Sign up failed. Please try again.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signInWithPassword({ email, password });
      if (!result.success) {
        return { success: false, error: result.error, needsVerification: result.needsVerification };
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const dbRoles = await fetchUserRoles(authUser.id);
        setUserRoles(dbRoles);
        if (isReader(dbRoles)) {
          await touchReaderLastLogin(authUser.id);
        }
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Sign in failed. Please try again.' };
    }
  };

  const signOut = async () => {
    await authService.logout();
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await authService.forgotPassword(
        { email },
        { redirectTo: `${SITE_URL}/reader/reset-password` },
      );
      if (!result.success) return { success: false, error: result.error };
      return { success: true };
    } catch {
      return { success: false, error: 'Could not send reset email.' };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Could not update password.' };
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return { success: false, error: 'No email on file.' };
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: { emailRedirectTo: `${SITE_URL}/reader/verify-email` },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Could not resend verification email.' };
    }
  };

  const refreshProfile = async () => {
    await loadProfile(user, userRoles);
  };

  return (
    <ReaderContext.Provider
      value={{
        session,
        user,
        profile,
        isReaderAuthenticated,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        resendVerificationEmail,
        refreshProfile,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}
