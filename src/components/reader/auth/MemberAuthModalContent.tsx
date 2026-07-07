import { useState } from 'react';
import { useReader } from '../../../context/ReaderContext';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';
import type { EmailAuthTab } from '../../../auth/public/publicAuthIntent';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface MemberEmailAuthProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  defaultTab?: EmailAuthTab;
  prefillEmail?: string | null;
}

export function MemberEmailAuthForm({
  onSuccess,
  onForgotPassword,
  defaultTab = 'sign-in',
  prefillEmail,
}: MemberEmailAuthProps) {
  const { signIn, signUp } = useReader();
  const [tab, setTab] = useState<EmailAuthTab>(defaultTab);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(prefillEmail ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tabBtnCls = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
        : 'text-gray-400 hover:text-gray-300 border border-transparent'
    }`;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      onSuccess?.();
      return;
    }
    setError(result.error ?? 'Sign in failed. Check your credentials.');
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the terms to create an account.');
      return;
    }

    setLoading(true);
    const result = await signUp({
      email,
      password,
      full_name: fullName.trim(),
      display_name: fullName.trim(),
    });
    setLoading(false);

    if (result.success) {
      if (result.needsVerification) {
        setSuccessMessage('Check your email to verify your account.');
        return;
      }
      onSuccess?.();
      return;
    }

    const msg = result.error?.toLowerCase() ?? '';
    if (msg.includes('already registered') || msg.includes('already exists')) {
      setError('An account with this email already exists. Sign in instead.');
      setTab('sign-in');
    } else {
      setError(result.error ?? 'Could not create account.');
    }
  };

  if (successMessage) {
    return (
      <div className="text-center space-y-4 py-2">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <p className="text-gray-300 text-sm">{successMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => { setTab('sign-in'); setError(null); }} className={tabBtnCls(tab === 'sign-in')}>
          Sign In
        </button>
        <button type="button" onClick={() => { setTab('create-account'); setError(null); }} className={tabBtnCls(tab === 'create-account')}>
          Create Account
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {tab === 'sign-in' ? (
        <form onSubmit={(e) => void handleSignIn(e)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          {onForgotPassword && (
            <div className="text-right">
              <button type="button" onClick={onForgotPassword} className="text-sm text-gold-400 hover:text-gold-300">
                Forgot Password
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => void handleCreateAccount(e)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 rounded border-navy-600"
            />
            <span>Accept Terms</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : 'Create Reader Account'}
          </button>
        </form>
      )}
    </div>
  );
}

export default MemberEmailAuthForm;
