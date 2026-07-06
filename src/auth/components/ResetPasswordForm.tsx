import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthErrorBanner } from './AuthErrorBanner';
import { AuthSuccessBanner } from './AuthSuccessBanner';
import { AUTH_INPUT_CLASS } from './AuthShell';
import { getPasswordStrengthHints } from '../utils/validation';

export interface ResetPasswordFormProps {
  token: string;
  loginPath?: string;
  onSuccess?: () => void;
}

export const ResetPasswordForm = memo(function ResetPasswordForm({
  token,
  loginPath = '/auth/login',
  onSuccess,
}: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      setLoading(true);

      const result = await resetPassword({ token, password, confirmPassword });
      setLoading(false);

      if (result.success) {
        setCompleted(true);
        onSuccess?.();
      } else {
        setError(result.error ?? 'Unable to reset password.');
      }
    },
    [confirmPassword, onSuccess, password, resetPassword, token]
  );

  if (!token) {
    return (
      <AuthErrorBanner message="Reset token is missing. Please use the link from your email." />
    );
  }

  return (
    <div>
      {error ? <AuthErrorBanner message={error} /> : null}
      {completed ? <AuthSuccessBanner message="Your password has been reset. You can now sign in." /> : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="auth-reset-password" className="mb-2 block text-sm text-gray-300">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-reset-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
              autoFocus
              className={`${AUTH_INPUT_CLASS} pl-10 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-gray-500" aria-label="Password requirements">
            {getPasswordStrengthHints().map((hint) => (
              <li key={hint}>• {hint}</li>
            ))}
          </ul>
        </div>

        <div>
          <label htmlFor="auth-reset-confirm-password" className="mb-2 block text-sm text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-reset-confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
              className={`${AUTH_INPUT_CLASS} pl-10`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || completed}
          className="w-full rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 transition-colors hover:bg-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Reset Password'}
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

export default ResetPasswordForm;
