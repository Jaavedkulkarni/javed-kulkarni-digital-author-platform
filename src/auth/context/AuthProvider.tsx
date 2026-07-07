import {

  useCallback,

  useEffect,

  useMemo,

  useReducer,

  useRef,

  type ReactNode,

} from 'react';

import type { AuthChangeEvent } from '@supabase/supabase-js';

import { supabase } from '../../lib/supabase';

import type {

  AuthContextValue,

  ForgotPasswordData,

  LoginCredentials,

  RegisterData,

  ResetPasswordData,

  VerifyEmailData,

} from '../types/auth.types';

import { AuthContext } from './AuthContext';

import { authReducer, initialAuthState } from './authReducer';

import { authService } from '../services/auth.service';
import { mapSupabaseSessionToAuthSession, getRememberMePreference } from '../services/supabaseSessionMapper';

import { shouldRefreshAccessToken } from '../services/tokenService';

import { normalizeEmail } from '../utils/validation';



const REFRESH_INTERVAL_MS = 60_000;

const PASSIVE_AUTH_EVENTS = new Set<AuthChangeEvent>(['INITIAL_SESSION', 'TOKEN_REFRESHED']);



export function AuthProvider({ children }: { children: ReactNode }) {

  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const refreshTimerRef = useRef<number | null>(null);



  const clearRefreshTimer = useCallback(() => {

    if (refreshTimerRef.current !== null) {

      window.clearInterval(refreshTimerRef.current);

      refreshTimerRef.current = null;

    }

  }, []);



  const refreshSession = useCallback(async () => {

    const result = await authService.refreshSession();



    if (result.success && result.data) {

      dispatch({ type: 'AUTH_REFRESH_SUCCESS', payload: result.data });

      return result;

    }



    dispatch({ type: 'AUTH_SESSION_EXPIRED' });

    return result;

  }, []);



  const restoreSession = useCallback(async () => {

    dispatch({ type: 'AUTH_INITIALIZE_START' });



    const result = await authService.restoreSession();



    if (result.success && result.data) {

      dispatch({ type: 'AUTH_INITIALIZE_SUCCESS', payload: result.data });

      return result;

    }



    dispatch({ type: 'AUTH_INITIALIZE_SUCCESS', payload: null });

    return result;

  }, []);



  useEffect(() => {

    void restoreSession();



    const {

      data: { subscription },

    } = supabase.auth.onAuthStateChange((event, session) => {

      if (event === 'INITIAL_SESSION') return;



      if (session) {

        if (PASSIVE_AUTH_EVENTS.has(event)) {

          dispatch({

            type: 'AUTH_REFRESH_SUCCESS',

            payload: mapSupabaseSessionToAuthSession(session, getRememberMePreference()),

          });

          return;

        }



        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'PASSWORD_RECOVERY') {

          dispatch({

            type: 'AUTH_REFRESH_SUCCESS',

            payload: mapSupabaseSessionToAuthSession(session, getRememberMePreference()),

          });

        }

        return;

      }



      if (event === 'SIGNED_OUT') {

        dispatch({ type: 'AUTH_LOGOUT' });

      }

    });



    return () => {

      subscription.unsubscribe();

      clearRefreshTimer();

    };

  }, [restoreSession, clearRefreshTimer]);



  useEffect(() => {

    clearRefreshTimer();



    if (!state.session) return;



    refreshTimerRef.current = window.setInterval(() => {

      const expiresAt = state.session?.tokens.accessTokenExpiresAt;

      if (expiresAt && shouldRefreshAccessToken(expiresAt)) {

        void refreshSession();

      }

    }, REFRESH_INTERVAL_MS);



    return clearRefreshTimer;

  }, [state.session, refreshSession, clearRefreshTimer]);



  const login = useCallback(async (credentials: LoginCredentials) => {

    dispatch({ type: 'AUTH_LOGIN_START' });



    const result = await authService.login(credentials);



    if (result.success && result.data) {

      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: result.data });

      return result;

    }



    if (result.needsVerification) {

      dispatch({

        type: 'AUTH_SET_PENDING_VERIFICATION',

        payload: normalizeEmail(credentials.email),

      });

    }



    dispatch({ type: 'AUTH_LOGIN_FAILURE', payload: result.error ?? 'Login failed.' });

    return result;

  }, []);



  const logout = useCallback(async () => {

    clearRefreshTimer();

    await authService.logout();

    dispatch({ type: 'AUTH_LOGOUT' });

  }, [clearRefreshTimer]);



  const register = useCallback(async (data: RegisterData) => {

    dispatch({ type: 'AUTH_REGISTER_START' });



    const result = await authService.register(data);



    if (result.success) {

      dispatch({

        type: 'AUTH_REGISTER_SUCCESS',

        payload: {

          session: result.data ?? null,

          needsVerification: result.needsVerification ?? false,

          email: normalizeEmail(data.email),

        },

      });

      return result;

    }



    dispatch({ type: 'AUTH_REGISTER_FAILURE', payload: result.error ?? 'Registration failed.' });

    return result;

  }, []);



  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {

    return authService.forgotPassword(data);

  }, []);



  const resetPassword = useCallback(async (data: ResetPasswordData) => {

    return authService.resetPassword(data);

  }, []);



  const verifyEmail = useCallback(async (data: VerifyEmailData) => {

    const result = await authService.verifyEmail(data);



    if (result.success && result.data) {

      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: result.data });

      return result;

    }



    return result;

  }, []);



  const resendVerificationEmail = useCallback(async (email: string) => {

    return authService.resendVerificationEmail(email);

  }, []);



  const clearError = useCallback(() => {

    dispatch({ type: 'AUTH_CLEAR_ERROR' });

  }, []);



  const value = useMemo<AuthContextValue>(

    () => ({

      state,

      login,

      logout,

      register,

      forgotPassword,

      resetPassword,

      verifyEmail,

      resendVerificationEmail,

      refreshSession,

      restoreSession,

      clearError,

    }),

    [

      state,

      login,

      logout,

      register,

      forgotPassword,

      resetPassword,

      verifyEmail,

      resendVerificationEmail,

      refreshSession,

      restoreSession,

      clearError,

    ]

  );



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}


