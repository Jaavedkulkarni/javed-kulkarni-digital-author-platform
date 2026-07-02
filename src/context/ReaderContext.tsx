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
import { isReaderUser, isAdminUser, adminMetadataNeedsRepair } from '../lib/authRoles';
import { getUserRole } from '../lib/authRoles';
import {
  ensureReaderProfile,
  fetchReaderProfile,
  touchReaderLastLogin,
} from '../lib/readerService';
import type { ReaderProfile, ReaderSignupData } from '../types/reader';

interface ReaderContextType {
  session: Session | null;
  user: User | null;
  profile: ReaderProfile | null;
  isReaderAuthenticated: boolean;
  loading: boolean;
  signUp: (data: ReaderSignupData) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: 'google' | 'azure' | 'facebook') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';
const OAUTH_INTENT_KEY = 'readerOAuthIntent';

async function ensureReaderRole(user: User): Promise<User> {
  if (isAdminUser(user)) {
    if (adminMetadataNeedsRepair(user)) {
      const { data, error } = await supabase.auth.updateUser({ data: { role: 'admin' } });
      if (!error && data.user) return data.user;
    }
    return user;
  }
  if (getUserRole(user) === 'reader') return user;
  const { data, error } = await supabase.auth.updateUser({
    data: {
      role: 'reader',
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name,
      display_name: user.user_metadata?.display_name ?? user.user_metadata?.name,
    },
  });
  if (error || !data.user) return user;
  return data.user;
}

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ReaderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (authUser: User | null) => {
    if (!authUser || !isReaderUser(authUser)) {
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
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      loadProfile(s?.user ?? null).finally(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      let nextUser = s?.user ?? null;

      if (nextUser && sessionStorage.getItem(OAUTH_INTENT_KEY) === '1') {
        sessionStorage.removeItem(OAUTH_INTENT_KEY);
        nextUser = await ensureReaderRole(nextUser);
      }

      setSession(s);
      setUser(nextUser);
      loadProfile(nextUser);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const isReaderAuthenticated = !!session && !!user && isReaderUser(user);

  const signUp = async (data: ReaderSignupData) => {
    try {
      const { data: result, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: 'reader',
            full_name: data.full_name,
            display_name: data.display_name || data.full_name,
          },
          emailRedirectTo: `${SITE_URL}/reader/verify-email`,
        },
      });
      if (error) return { success: false, error: error.message };
      const needsVerification = !result.session;
      return { success: true, needsVerification };
    } catch {
      return { success: false, error: 'Sign up failed. Please try again.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      if (!isReaderUser(data.user)) {
        await supabase.auth.signOut();
        return { success: false, error: 'This account is not a reader account. Please use the admin login for CMS access.' };
      }
      await touchReaderLastLogin(data.user.id);
      return { success: true };
    } catch {
      return { success: false, error: 'Sign in failed. Please try again.' };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'azure' | 'facebook') => {
    try {
      sessionStorage.setItem(OAUTH_INTENT_KEY, '1');
      const redirectTo = `${SITE_URL}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: provider === 'google' ? { access_type: 'offline', prompt: 'consent' } : undefined,
        },
      });
      if (error) {
        sessionStorage.removeItem(OAUTH_INTENT_KEY);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch {
      sessionStorage.removeItem(OAUTH_INTENT_KEY);
      return { success: false, error: 'Social sign-in failed. Please try again.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/reader/reset-password`,
      });
      if (error) return { success: false, error: error.message };
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
    await loadProfile(user);
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
        signInWithOAuth,
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
