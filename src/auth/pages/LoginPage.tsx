import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthShell } from '../components/AuthShell';
import { LoginForm } from '../components/LoginForm';
import { useBootstrap } from '../bootstrap';
import { resolvePostLoginRoute } from '../routing/resolvePostLoginRoute';
import { processAuthCallback } from '../../lib/authCallback';

export function LoginPage() {
  const navigate = useNavigate();
  const { refresh, isReady } = useBootstrap();
  const [oauthProcessing, setOauthProcessing] = useState(false);

  useEffect(() => {
    void processAuthCallback().then(async (type) => {
      if (!type || !isReady) return;
      setOauthProcessing(true);
      const target = await resolvePostLoginRoute(refresh);
      navigate(target, { replace: true });
    });
  }, [navigate, refresh, isReady]);

  return (
    <AuthShell title="Sign In" subtitle="AuthorOS account access">
      <LoginForm
        onSuccess={async () => {
          const target = await resolvePostLoginRoute(refresh);
          navigate(target, { replace: true });
        }}
      />
      {oauthProcessing ? (
        <p className="mt-4 text-center text-xs text-gray-500">Completing sign in…</p>
      ) : null}
    </AuthShell>
  );
}

export default LoginPage;
