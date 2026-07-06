import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthErrorBanner } from './AuthErrorBanner';
import { AuthSuccessBanner } from './AuthSuccessBanner';
import { AUTH_INPUT_CLASS } from './AuthShell';
import { getPasswordStrengthHints } from '../utils/validation';

export interface RegisterFormProps {
  onSuccess?: () => void;
  onVerificationRequired?: (email: string) => void;
  loginPath?: string;
  compact?: boolean;
}

export const RegisterForm = memo(function RegisterForm({
  onSuccess,
  onVerificationRequired,
  loginPath = '/auth/login',
  compact = false,
}: RegisterFormProps) {
  const { register, error, clearError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      clearError();
      setLoading(true);

      const result = await register({ fullName, email, password, confirmPassword });
      setLoading(false);

      if (result.success) {
        if (result.needsVerification) {
          setVerificationSent(true);
          onVerificationRequired?.(email);
          return;
        }

        onSuccess?.();
      }
    },
    [clearError, confirmPassword, email, fullName, onSuccess, onVerificationRequired, password, register]
  );

  return (
    <div>
      {error ? <AuthErrorBanner message={error} /> : null}
      {verificationSent ? (
        <AuthSuccessBanner message="Account created. Check your email to verify your account before signing in." />
      ) : null}

      <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'} noValidate>
        <div>
          <label htmlFor="auth-register-name" className="mb-2 block text-sm text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-register-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              autoComplete="name"
              autoFocus
              className={`${AUTH_INPUT_CLASS} pl-10`}
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="auth-register-email" className="mb-2 block text-sm text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className={`${AUTH_INPUT_CLASS} pl-10`}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="auth-register-password" className="mb-2 block text-sm text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
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
          <label htmlFor="auth-register-confirm-password" className="mb-2 block text-sm text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="auth-register-confirm-password"
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
          disabled={loading}
          className="w-full rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 transition-colors hover:bg-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link
          to={loginPath}
          className="text-gold-400 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
});

export default RegisterForm;
