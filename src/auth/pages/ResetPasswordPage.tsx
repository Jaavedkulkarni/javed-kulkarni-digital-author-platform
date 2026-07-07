import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { processAuthCallback } from '../../lib/authCallback';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(
    () => searchParams.get('token') ?? searchParams.get('token_hash') ?? '',
  );
  const [processingCallback, setProcessingCallback] = useState(false);

  useEffect(() => {
    setProcessingCallback(true);
    void processAuthCallback().then(() => {
      setProcessingCallback(false);
      const hashToken = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token_hash');
      const nextToken =
        searchParams.get('token') ??
        searchParams.get('token_hash') ??
        hashToken ??
        'recovery';
      setToken(nextToken);
    });
  }, [searchParams]);

  return (
    <AuthShell title="Reset Password" subtitle="Choose a new password">
      {processingCallback ? (
        <p className="text-center text-sm text-gray-400">Preparing password reset…</p>
      ) : (
        <ResetPasswordForm
          token={token}
          onSuccess={() => navigate('/auth/login', { replace: true })}
        />
      )}
    </AuthShell>
  );
}

export default ResetPasswordPage;
