import { useEffect } from 'react';
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

/** Tracks public pages for logout restoration and routes Supabase email auth callbacks. */
export function AuthRouteEffects() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    trackPublicPage(location.pathname, location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    let cancelled = false;

    const handleCallback = async () => {
      try {
        const callbackType = detectAuthCallbackType(location.pathname);
        if (!callbackType) return;

        const targetPath = authCallbackTargetPath(callbackType, location.pathname);
        if (targetPath && !location.pathname.startsWith(targetPath)) {
          navigate(`${targetPath}${location.search}${location.hash}`, { replace: true });
          return;
        }

        await processAuthCallback();

        if (cancelled) return;

        const { data: { session } } = await supabase.auth.getSession();

        if (!session && hasAuthCallbackParams(location.pathname, location.search, location.hash)) {
          return;
        }

        const cleanUrl = buildCleanAuthUrl(location.pathname, location.search, location.hash);
        const currentUrl = `${location.pathname}${location.search}${location.hash}`;
        if (cleanUrl !== currentUrl) {
          navigate(cleanUrl, { replace: true });
        }
      } catch (error) {
        console.error('Auth callback handling failed:', error);
      }
    };

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
}

export default AuthRouteEffects;
