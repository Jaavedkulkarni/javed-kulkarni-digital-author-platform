import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthErrorBanner } from './AuthErrorBanner';
import { AuthSuccessBanner } from './AuthSuccessBanner';
import { AUTH_INPUT_CLASS } from './AuthShell';

export interface ForgotPasswordFormProps {
  loginPath?: string;
}

export const ForgotPasswordForm = memo(function ForgotPasswordForm({
  loginPath = '/auth/login',
}: ForgotPasswordFormProps) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      setLoading(true);

      const result = await forgotPassword({ email });
      setLoading(false);

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? 'Unable to process request.');
      }
    },
    [email, forgotPassword]
  );

  return (
    <div>
      {error ? <AuthErrorBanner message={error} /> : null}
      {submitted ? (
        <AuthSuccessBanner message="If an account exists for this email, password reset instructions have been sent." />
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="auth-forgot-email" className="mb-2 block text-sm text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              autoFocus
              className={`${AUTH_INPUT_CLASS} pl-10`}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 transition-colors hover:bg-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

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

export default ForgotPasswordForm;
