import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { VerifyEmailPanel } from '../components/VerifyEmailPanel';
import { useAuth } from '../hooks/useAuth';
import { useBootstrap } from '../bootstrap';
import { processAuthCallback } from '../../lib/authCallback';
import { resolvePostLoginRoute } from '../routing/resolvePostLoginRoute';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pendingVerificationEmail } = useAuth();
  const { refresh } = useBootstrap();
  const [token, setToken] = useState<string | undefined>(
    () => searchParams.get('token') ?? searchParams.get('token_hash') ?? undefined,
  );
  const [processingCallback, setProcessingCallback] = useState(false);

  const email = searchParams.get('email') ?? pendingVerificationEmail ?? undefined;

  useEffect(() => {
    setProcessingCallback(true);
    void processAuthCallback().then(() => {
      setProcessingCallback(false);
      const hashToken = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token_hash');
      const queryToken = searchParams.get('token') ?? searchParams.get('token_hash') ?? hashToken ?? undefined;
      if (queryToken) setToken(queryToken);
    });
  }, [searchParams]);

  return (
    <AuthShell title="Verify Email" subtitle="Confirm your email address">
      {processingCallback ? (
        <p className="text-center text-sm text-gray-400">Processing verification link…</p>
      ) : (
        <VerifyEmailPanel
          token={token}
          email={email}
          onSuccess={async () => {
            await refresh();
            navigate(await resolvePostLoginRoute(refresh), { replace: true });
          }}
        />
      )}
    </AuthShell>
  );
}

export default VerifyEmailPage;
