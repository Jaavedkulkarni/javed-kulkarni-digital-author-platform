import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
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
import {
  mockForgotPassword,
  mockLogin,
  mockLogout,
  mockRefreshSession,
  mockRegister,
  mockResendVerificationEmail,
  mockResetPassword,
  mockRestoreSession,
  mockVerifyEmail,
} from '../services/mockAuthService';
import { shouldRefreshAccessToken } from '../services/tokenService';
import { normalizeEmail } from '../utils/validation';

const REFRESH_INTERVAL_MS = 60_000;

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
    const result = await mockRefreshSession();

    if (result.success && result.data) {
      dispatch({ type: 'AUTH_REFRESH_SUCCESS', payload: result.data });
      return result;
    }

    dispatch({ type: 'AUTH_SESSION_EXPIRED' });
    return result;
  }, []);

  const restoreSession = useCallback(async () => {
    dispatch({ type: 'AUTH_INITIALIZE_START' });

    const result = await mockRestoreSession();

    if (result.success && result.data) {
      dispatch({ type: 'AUTH_INITIALIZE_SUCCESS', payload: result.data });
      return result;
    }

    dispatch({ type: 'AUTH_INITIALIZE_SUCCESS', payload: null });
    return result;
  }, []);

  useEffect(() => {
    void restoreSession();

    return () => {
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

    const result = await mockLogin(credentials);

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
    await mockLogout();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, [clearRefreshTimer]);

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'AUTH_REGISTER_START' });

    const result = await mockRegister(data);

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
    return mockForgotPassword(data);
  }, []);

  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    return mockResetPassword(data);
  }, []);

  const verifyEmail = useCallback(async (data: VerifyEmailData) => {
    const result = await mockVerifyEmail(data);

    if (result.success && result.data) {
      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: result.data });
      return result;
    }

    return result;
  }, []);

  const resendVerificationEmail = useCallback(async (email: string) => {
    return mockResendVerificationEmail(email);
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
