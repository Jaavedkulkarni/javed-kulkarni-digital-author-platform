import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AuthChangeEvent, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { setCachedRoles } from '../../lib/roleCache';
import { AuthBootstrapContext, type AuthBootstrapContextValue } from './AuthBootstrapContext';
import { authBootstrapService } from './auth-bootstrap.service';
import type { AuthBootstrapError, AuthBootstrapPayload, AuthBootstrapState } from './auth-bootstrap.types';
import { INITIAL_AUTH_BOOTSTRAP_STATE } from './auth-bootstrap.types';
import {
  clearBootstrapCache,
  hydrateBootstrapFromCache,
  readCachedBootstrapSnapshot,
  writeBootstrapCache,
} from './bootstrap-cache';

const PASSIVE_AUTH_EVENTS = new Set<AuthChangeEvent>(['TOKEN_REFRESHED']);

function toReadyState(payload: AuthBootstrapPayload): AuthBootstrapState {
  return {
    user: payload.user,
    profile: payload.profile,
    assignedRoles: payload.assignedRoles,
    effectiveRoles: payload.effectiveRoles,
    permissions: payload.permissions,
    navigation: payload.navigation,
    loading: false,
    isReady: true,
    error: null,
  };
}

function toErrorState(error: AuthBootstrapError): AuthBootstrapState {
  return {
    ...INITIAL_AUTH_BOOTSTRAP_STATE,
    loading: false,
    isReady: false,
    error,
  };
}

function toGuestState(): AuthBootstrapState {
  return {
    ...INITIAL_AUTH_BOOTSTRAP_STATE,
    loading: false,
    isReady: true,
    error: null,
  };
}

export function AuthBootstrapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthBootstrapState>(INITIAL_AUTH_BOOTSTRAP_STATE);
  const inflightRef = useRef<Promise<AuthBootstrapPayload | null> | null>(null);
  const lastUserIdRef = useRef<string | null>(null);

  const runBootstrap = useCallback(
    async (user: User | null, event?: AuthChangeEvent): Promise<AuthBootstrapPayload | null> => {
      if (!user) {
        inflightRef.current = null;
        lastUserIdRef.current = null;
        clearBootstrapCache();
        setState(toGuestState());
        return null;
      }

      if (event && PASSIVE_AUTH_EVENTS.has(event)) {
        return null;
      }

      if (inflightRef.current) {
        return inflightRef.current;
      }

      const cachedSnapshot = readCachedBootstrapSnapshot(user.id);
      const hasCachedReady = Boolean(cachedSnapshot);
      const isInitialRestore = event === 'INITIAL_SESSION';

      if (hasCachedReady && cachedSnapshot && isInitialRestore) {
        const hydrated = hydrateBootstrapFromCache(user, cachedSnapshot);
        setCachedRoles(user.id, hydrated.assignedRoles, hydrated.profile);
        setState(toReadyState(hydrated));
        lastUserIdRef.current = user.id;
      } else if (!hasCachedReady || event === 'SIGNED_IN') {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          isReady: prev.user?.id === user.id && prev.isReady ? prev.isReady : false,
        }));
      }

      const task = (async (): Promise<AuthBootstrapPayload | null> => {
        try {
          const payload = await authBootstrapService.bootstrap(user);
          writeBootstrapCache(payload);
          setCachedRoles(user.id, payload.assignedRoles, payload.profile);
          setState(toReadyState(payload));
          lastUserIdRef.current = user.id;
          return payload;
        } catch (error) {
          const bootstrapError = error as AuthBootstrapError;
          if (!hasCachedReady || event === 'SIGNED_IN') {
            setState(toErrorState(bootstrapError));
          }
          return null;
        } finally {
          inflightRef.current = null;
        }
      })();

      inflightRef.current = task;
      return task;
    },
    [],
  );

  const refresh = useCallback(async (): Promise<AuthBootstrapPayload | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return runBootstrap(session?.user ?? null);
  }, [runBootstrap]);

  const clear = useCallback(() => {
    inflightRef.current = null;
    lastUserIdRef.current = null;
    clearBootstrapCache();
    setState(toGuestState());
  }, []);

  useEffect(() => {
    let cancelled = false;

    const sync = async (user: User | null, event?: AuthChangeEvent) => {
      if (cancelled) return;
      await runBootstrap(user, event);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      window.setTimeout(() => {
        sync(session?.user ?? null, event).catch(console.error);
      }, 0);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [runBootstrap]);

  const value = useMemo<AuthBootstrapContextValue>(
    () => ({
      ...state,
      refresh,
      clear,
    }),
    [state, refresh, clear],
  );

  return <AuthBootstrapContext.Provider value={value}>{children}</AuthBootstrapContext.Provider>;
}

export default AuthBootstrapProvider;
