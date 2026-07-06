import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthErrorBanner } from './AuthErrorBanner';
import { AUTH_INPUT_CLASS } from './AuthShell';

export interface LoginFormProps {
  onSuccess?: (role?: import('../types/roles.types').AuthRole) => void;
  forgotPasswordPath?: string;
  registerPath?: string;
  compact?: boolean;
}

export const LoginForm = memo(function LoginForm({
  onSuccess,
  forgotPasswordPath = '/auth/forgot-password',
  registerPath = '/auth/register',
  compact = false,
}: LoginFormProps) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      clearError();
      setLoading(true);

      const result = await login({ email, password, rememberMe });
      setLoading(false);

      if (result.success) {
        onSuccess?.(result.data?.user.role);
      }
    },
    [clearError, email, login, onSuccess, password, rememberMe]
  );

  return (
    <div>
      {error ? <AuthErrorBanner message={error} /> : null}

      <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'} noValidate>
        <div>
          <label htmlFor="auth-login-email" className="mb-2 block text-sm text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-login-email"
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

        <div>
          <label htmlFor="auth-login-password" className="mb-2 block text-sm text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
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
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="rounded border-gray-300 text-brand focus:ring-gold-400/50"
            />
            Remember me
          </label>
          <Link
            to={forgotPasswordPath}
            className="text-sm text-gold-400 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 transition-colors hover:bg-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          to={registerPath}
          className="text-gold-400 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
        >
          Create account
        </Link>
      </p>
    </div>
  );
});

export default LoginForm;
