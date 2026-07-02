import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReader } from '../../../context/ReaderContext';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

export interface MemberEmailAuthProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export function MemberEmailAuthForm({ onSuccess, onForgotPassword }: MemberEmailAuthProps) {
  const { signIn, signUp } = useReader();
  const [mode, setMode] = useState<'email' | 'register'>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'register') {
      const result = await signUp({ email, password, full_name: fullName, display_name: fullName });
      setLoading(false);
      if (result.success) {
        if (result.needsVerification) {
          setError('Check your email to verify your account, then continue.');
        } else {
          onSuccess?.();
        }
      } else {
        setError(result.error ?? 'Could not create account.');
      }
      return;
    }

    const result = await signIn(email, password);
    setLoading(false);
    if (result.success) {
      onSuccess?.();
      return;
    }

    const msg = result.error?.toLowerCase() ?? '';
    if (msg.includes('invalid') || msg.includes('credentials')) {
      setMode('register');
      setError('No account found for this email. Enter your name to create one.');
    } else {
      setError(result.error ?? 'Could not sign in.');
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleContinue} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={`${inputCls} pl-10`} />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`${inputCls} pl-10`} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={`${inputCls} pl-10`} />
          </div>
        </div>
        {mode === 'email' && onForgotPassword && (
          <div className="text-right">
            <button type="button" onClick={onForgotPassword} className="text-sm text-gold-400 hover:text-gold-300">
              Forgot password?
            </button>
          </div>
        )}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50">
          {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Continue with Email'}
        </button>
      </form>
      {mode === 'register' && (
        <p className="mt-3 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <button type="button" onClick={() => { setMode('email'); setError(null); }} className="text-gold-400 hover:text-gold-300">
            Sign in instead
          </button>
        </p>
      )}
    </div>
  );
}

export function SocialAuthButtons({
  onOAuth,
  loading,
}: {
  onOAuth: (provider: 'google' | 'azure' | 'facebook') => void;
  loading?: boolean;
}) {
  const btnCls =
    'w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-navy-600 bg-navy-700/50 text-white text-sm font-medium hover:bg-navy-700 transition-colors disabled:opacity-50';

  return (
    <div className="space-y-3">
      <button type="button" disabled={loading} onClick={() => onOAuth('google')} className={btnCls}>
        Continue with Google
      </button>
      <button type="button" disabled={loading} onClick={() => onOAuth('azure')} className={btnCls}>
        Continue with Microsoft
      </button>
      <button type="button" disabled={loading} onClick={() => onOAuth('facebook')} className={btnCls}>
        Continue with Facebook
      </button>
    </div>
  );
}

export default MemberEmailAuthForm;
