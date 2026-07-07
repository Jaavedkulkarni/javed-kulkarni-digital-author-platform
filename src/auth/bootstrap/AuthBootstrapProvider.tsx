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
      console.log('B0 runBootstrap enter', { hasUser: Boolean(user), event });

      if (!user) {
        console.log('B0a runBootstrap guest path');
        inflightRef.current = null;
        lastUserIdRef.current = null;
        clearBootstrapCache();
        setState(toGuestState());
        return null;
      }

      if (event && PASSIVE_AUTH_EVENTS.has(event)) {
        console.log('B0b runBootstrap passive skip', { event });
        return null;
      }

      if (inflightRef.current) {
        console.log('B0c before await inflightRef.current');
        const inflightResult = await inflightRef.current;
        console.log('B0d after await inflightRef.current', { hasResult: Boolean(inflightResult) });
        return inflightResult;
      }

      const cachedSnapshot = readCachedBootstrapSnapshot(user.id);
      const hasCachedReady = Boolean(cachedSnapshot);
      const isInitialRestore = event === 'INITIAL_SESSION';
      console.log('B0e cache check', { hasCachedReady, isInitialRestore, event });

      if (hasCachedReady && cachedSnapshot && isInitialRestore) {
        const hydrated = hydrateBootstrapFromCache(user, cachedSnapshot);
        setCachedRoles(user.id, hydrated.assignedRoles, hydrated.profile);
        setState(toReadyState(hydrated));
        console.log('B0f runBootstrap cache hydrate isReady=true', { userId: user.id, event });
        lastUserIdRef.current = user.id;
      } else if (!hasCachedReady || event === 'SIGNED_IN') {
        console.log('B0g runBootstrap setState loading=true', { event });
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          isReady: prev.user?.id === user.id && prev.isReady ? prev.isReady : false,
        }));
      }

      const task = (async (): Promise<AuthBootstrapPayload | null> => {
        try {
          console.log('B1 before await authBootstrapService.bootstrap', { userId: user.id, event });
          const payload = await authBootstrapService.bootstrap(user);
          console.log('B2 after await authBootstrapService.bootstrap', { userId: user.id, event });
          writeBootstrapCache(payload);
          setCachedRoles(user.id, payload.assignedRoles, payload.profile);
          setState(toReadyState(payload));
          console.log('B2b runBootstrap setState isReady=true', { userId: user.id, event });
          lastUserIdRef.current = user.id;
          return payload;
        } catch (error) {
          console.log('B2c runBootstrap bootstrap error', { event, error });
          const bootstrapError = error as AuthBootstrapError;
          if (!hasCachedReady || event === 'SIGNED_IN') {
            setState(toErrorState(bootstrapError));
          }
          return null;
        } finally {
          inflightRef.current = null;
          console.log('B2d runBootstrap task finally', { event });
        }
      })();

      inflightRef.current = task;
      console.log('B0h runBootstrap return task promise', { event });
      return task;
    },
    [],
  );

  const refresh = useCallback(async (): Promise<AuthBootstrapPayload | null> => {
    console.log('B3 refresh enter');
    console.log('B4 before await getSession (refresh)');
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log('B5 after await getSession (refresh)', { hasSession: Boolean(session) });
    console.log('B6 before await runBootstrap (refresh)');
    const result = await runBootstrap(session?.user ?? null);
    console.log('B7 after await runBootstrap (refresh)', { hasResult: Boolean(result) });
    return result;
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
      if (cancelled) {
        console.log('B8 sync cancelled', { event });
        return;
      }
      console.log('B8 sync enter', { hasUser: Boolean(user), event });
      console.log('B9 before await runBootstrap (sync)', { event });
      await runBootstrap(user, event);
      console.log('B10 after await runBootstrap (sync)', { event });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('B8a onAuthStateChange fired', { event, hasSession: Boolean(session?.user) });
      window.setTimeout(() => {
        console.log('B8b setTimeout sync scheduled', { event });
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
