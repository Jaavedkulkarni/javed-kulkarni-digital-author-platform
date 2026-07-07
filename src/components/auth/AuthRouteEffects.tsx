import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  buildCleanAuthUrl,
  detectAuthCallbackType,
  hasAuthCallbackParams,
  processAuthCallback,
  authCallbackTargetPath,
} from '../../lib/authCallback';
import { supabase } from '../../lib/supabase';
import { trackPublicPage } from '../../lib/authRedirect';
import { useBootstrap } from '../../auth/bootstrap/hooks';
import {
  clearPublicAuthIntent,
  peekPublicAuthIntent,
  peekPublicAuthOAuthResume,
  consumePublicAuthOAuthResume,
} from '../../auth/public/publicAuthIntent';
import { resolvePostLoginRouteFromEffectiveRoles } from '../../auth/routing/resolvePostLoginRoute';

function OAuthLoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-navy-900"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gold-400 border-t-transparent" />
        <p className="text-white">Completing sign in…</p>
      </div>
    </div>
  );
}

/** Tracks public pages for logout restoration and routes Supabase auth callbacks. */
export function AuthRouteEffects() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectStartedRef = useRef(false);
  const {
    user,
    effectiveRoles,
    isReady,
    loading: bootstrapLoading,
  } = useBootstrap();

  const hasCallbackParams = hasAuthCallbackParams(
    location.pathname,
    location.search,
    location.hash,
  );
  const oauthResumePending = peekPublicAuthOAuthResume();
  const oauthFlowActive = hasCallbackParams || oauthResumePending;
  const bootstrapGate = bootstrapLoading || !user || !isReady;
  const showOAuthLoading = oauthFlowActive && bootstrapGate;

  console.log('CALLBACK PARAMS', hasCallbackParams);
  console.log('OAUTH RESUME', peekPublicAuthOAuthResume());
  console.log('SHOW LOADING', showOAuthLoading);
  console.log('BOOTSTRAP', {
    loading: bootstrapLoading,
    ready: isReady,
    user: !!user,
  });
  if (showOAuthLoading) {
    console.log('SHOW LOADING cause', {
      oauthFlowActive,
      hasCallbackParams,
      oauthResumePending,
      bootstrapLoading,
      notUser: !user,
      notReady: !isReady,
      bootstrapGate,
    });
  }

  useEffect(() => {
    trackPublicPage(location.pathname, location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    redirectStartedRef.current = false;
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    let cancelled = false;

    const handleCallback = async () => {
      try {
        console.log('D0 handleCallback enter', { pathname: location.pathname, search: location.search });
        const callbackType = detectAuthCallbackType(location.pathname);
        console.log('D0b detectAuthCallbackType', { callbackType });
        if (!callbackType) {
          console.log('D0c handleCallback exit (no callback type)');
          return;
        }

        const targetPath = authCallbackTargetPath(callbackType, location.pathname);
        console.log('D0d authCallbackTargetPath', { targetPath });
        if (targetPath && !location.pathname.startsWith(targetPath)) {
          console.log('D0e navigate to targetPath', { targetPath });
          navigate(`${targetPath}${location.search}${location.hash}`, { replace: true });
          return;
        }

        console.log('D1 before await processAuthCallback');
        await processAuthCallback();
        console.log('D2 after await processAuthCallback');

        if (cancelled) {
          console.log('D2a handleCallback cancelled after processAuthCallback');
          return;
        }

        console.log('D3 before await getSession (handleCallback)');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('D4 after await getSession (handleCallback)', { hasSession: Boolean(session) });

        if (!session && hasAuthCallbackParams(location.pathname, location.search, location.hash)) {
          console.log('D4a handleCallback exit (no session, still has callback params)');
          return;
        }

        const cleanUrl = buildCleanAuthUrl(location.pathname, location.search, location.hash);
        const currentUrl = `${location.pathname}${location.search}${location.hash}`;
        if (cleanUrl !== currentUrl) {
          console.log('D5 navigate cleanUrl', { cleanUrl, currentUrl });
          navigate(cleanUrl, { replace: true });
        }
        console.log('D6 handleCallback exit success');
      } catch (error) {
        console.error('D-ERR handleCallback failed:', error);
      }
    };

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, location.hash, navigate]);

  useEffect(() => {
    console.log('D-R0 redirect effect enter', {
      bootstrapLoading,
      hasUser: Boolean(user),
      isReady,
      oauthResumePending,
      hasCallbackParams,
      pathname: location.pathname,
      search: location.search,
    });

    if (bootstrapLoading || !user || !isReady) {
      console.log('D-R1 redirect blocked (bootstrap gate)', {
        bootstrapLoading,
        notUser: !user,
        notReady: !isReady,
      });
      return;
    }

    const isOAuthReturn =
      oauthResumePending ||
      hasAuthCallbackParams(location.pathname, location.search, location.hash);
    console.log('D-R2 isOAuthReturn', { isOAuthReturn, oauthResumePending, hasCallbackParams });

    if (!isOAuthReturn) {
      console.log('D-R3 redirect exit (not oauth return)');
      return;
    }

    const intent = peekPublicAuthIntent() ?? 'members-login';
    console.log('D-R4 intent', { intent });
    if (intent !== 'members-login') {
      console.log('D-R5 redirect exit (intent not members-login)');
      return;
    }

    const path = resolvePostLoginRouteFromEffectiveRoles(effectiveRoles);
    console.log('D-R6 resolved path', { path, locationPathname: location.pathname, redirectStarted: redirectStartedRef.current });
    if (!path || path === location.pathname || redirectStartedRef.current) {
      console.log('D-R7 redirect exit (no path / same path / already started)');
      return;
    }

    redirectStartedRef.current = true;
    consumePublicAuthOAuthResume();
    clearPublicAuthIntent();
    console.log('D-R8 REDIRECT navigate', { path, effectiveRoles });
    navigate(path, { replace: true });
    console.log('D-R9 redirect effect done');
  }, [
    user,
    bootstrapLoading,
    isReady,
    effectiveRoles,
    navigate,
    location.pathname,
    location.search,
    location.hash,
    oauthResumePending,
    hasCallbackParams,
  ]);

  if (showOAuthLoading) {
    return <OAuthLoadingScreen />;
  }

  return null;
}

export default AuthRouteEffects;
