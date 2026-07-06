import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { isAccessTokenValid, shouldRefreshAccessToken } from '../services/tokenService';

export function useSession() {
  const { session, refreshSession, isAuthenticated } = useAuth();

  const accessToken = session?.tokens.accessToken ?? null;
  const refreshToken = session?.tokens.refreshToken ?? null;
  const rememberMe = session?.rememberMe ?? false;

  const expiresAt = session?.tokens.accessTokenExpiresAt ?? null;
  const refreshExpiresAt = session?.tokens.refreshTokenExpiresAt ?? null;

  const isExpired = useMemo(() => {
    if (!accessToken) return true;
    return !isAccessTokenValid(accessToken);
  }, [accessToken]);

  const needsRefresh = useMemo(() => {
    if (!expiresAt) return false;
    return shouldRefreshAccessToken(expiresAt);
  }, [expiresAt]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      return { success: false as const, error: 'Not authenticated.' };
    }

    return refreshSession();
  }, [isAuthenticated, refreshSession]);

  return {
    session,
    accessToken,
    refreshToken,
    rememberMe,
    expiresAt,
    refreshExpiresAt,
    isExpired,
    needsRefresh,
    refreshSession: refresh,
    lastRefreshedAt: session?.lastRefreshedAt ?? null,
  };
}
