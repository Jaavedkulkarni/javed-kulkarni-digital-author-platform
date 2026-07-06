import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthErrorBanner } from './AuthErrorBanner';
import { AuthSuccessBanner } from './AuthSuccessBanner';

export interface VerifyEmailPanelProps {
  token?: string;
  email?: string;
  loginPath?: string;
  onSuccess?: () => void;
}

export const VerifyEmailPanel = memo(function VerifyEmailPanel({
  token,
  email,
  loginPath = '/auth/login',
  onSuccess,
}: VerifyEmailPanelProps) {
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = useCallback(async () => {
    if (!token) {
      setError('Verification token is missing.');
      return;
    }

    setError(null);
    setLoading(true);

    const result = await verifyEmail({ token });
    setLoading(false);

    if (result.success) {
      setVerified(true);
      onSuccess?.();
    } else {
      setError(result.error ?? 'Verification failed.');
    }
  }, [onSuccess, token, verifyEmail]);

  const handleResend = useCallback(async () => {
    if (!email) return;

    setResending(true);
    const result = await resendVerificationEmail(email);
    setResending(false);

    if (result.success) {
      setResent(true);
    } else {
      setError(result.error ?? 'Unable to resend verification email.');
    }
  }, [email, resendVerificationEmail]);

  return (
    <div>
      {error ? <AuthErrorBanner message={error} /> : null}
      {verified ? <AuthSuccessBanner message="Your email has been verified. Redirecting…" /> : null}
      {resent ? <AuthSuccessBanner message="Verification email resent." /> : null}

      <p className="mb-6 text-sm text-gray-300">
        {email
          ? `Verify the email address ${email} to activate your AuthorOS account.`
          : 'Verify your email address to activate your AuthorOS account.'}
      </p>

      {token ? (
        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={loading || verified}
          className="mb-4 w-full rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 transition-colors hover:bg-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Verifying…' : 'Verify Email'}
        </button>
      ) : null}

      {email ? (
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={resending}
          className="w-full rounded-lg border border-navy-600 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? 'Resending…' : 'Resend Verification Email'}
        </button>
      ) : null}

      <p className="mt-6 text-center text-sm text-gray-400">
        <Link
          to={loginPath}
          className="text-gold-400 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
});

export default VerifyEmailPanel;
