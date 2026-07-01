import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { detectAuthCallbackType, processAuthCallback, authCallbackTargetPath } from '../../lib/authCallback';
import { trackPublicPage } from '../../lib/authRedirect';

/** Tracks public pages for logout restoration and routes Supabase auth callbacks. */
export function AuthRouteEffects() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    trackPublicPage(location.pathname, location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const callbackType = detectAuthCallbackType();
    if (!callbackType) return;

    const targetPath = authCallbackTargetPath(callbackType);
    if (!targetPath) return;

    if (!location.pathname.startsWith(targetPath)) {
      const suffix = `${location.search}${location.hash}`;
      navigate(`${targetPath}${suffix}`, { replace: true });
      return;
    }

    void processAuthCallback();
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
}

export default AuthRouteEffects;
