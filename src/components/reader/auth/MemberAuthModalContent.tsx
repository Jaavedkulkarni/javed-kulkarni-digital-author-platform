import { useState } from 'react';
import { useReader } from '../../../context/ReaderContext';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';
import { isOAuthProviderEnabled, oauthUnavailableMessage, type OAuthProvider } from '../../../lib/oauthConfig';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface MemberEmailAuthProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export function MemberEmailAuthForm({ onSuccess, onForgotPassword }: MemberEmailAuthProps) {
  const { signIn, signUp } = useReader();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const signInResult = await signIn(email, password);
    if (signInResult.success) {
      setLoading(false);
      onSuccess?.();
      return;
    }

    if (!fullName.trim()) {
      setLoading(false);
      setError(signInResult.error ?? 'Enter your name to create a new account, or check your password.');
      return;
    }

    const signUpResult = await signUp({
      email,
      password,
      full_name: fullName.trim(),
      display_name: fullName.trim(),
    });
    setLoading(false);

    if (signUpResult.success) {
      if (signUpResult.needsVerification) {
        setSuccessMessage('Check your email to verify your account.');
        return;
      }
      onSuccess?.();
      return;
    }

    const msg = signUpResult.error?.toLowerCase() ?? '';
    if (msg.includes('already registered') || msg.includes('already exists')) {
      setError('An account with this email already exists. Check your password or use Forgot password.');
    } else {
      setError(signUpResult.error ?? signInResult.error ?? 'Could not continue with this email.');
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
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleContinue} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={`${inputCls} pl-10`} />
          </div>
        </div>
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
        {onForgotPassword && (
          <div className="text-right">
            <button type="button" onClick={onForgotPassword} className="text-sm text-gold-400 hover:text-gold-300">
              Forgot password?
            </button>
          </div>
        )}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50">
          {loading ? 'Please wait...' : 'Continue with Email'}
        </button>
      </form>
    </div>
  );
}

const PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: 'Continue with Google',
  azure: 'Continue with Microsoft',
  facebook: 'Continue with Facebook',
};

export function SocialAuthButtons({
  onOAuth,
  loading,
  oauthError,
}: {
  onOAuth: (provider: OAuthProvider) => void;
  loading?: boolean;
  oauthError?: string | null;
}) {
  const btnCls =
    'w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-navy-600 bg-navy-700/50 text-white text-sm font-medium hover:bg-navy-700 transition-colors disabled:opacity-50';

  const providers: OAuthProvider[] = ['google', 'azure', 'facebook'];

  return (
    <div className="space-y-3">
      {oauthError && (
        <p className="text-sm text-amber-400 text-center">{oauthError}</p>
      )}
      {providers.map((provider) => {
        const enabled = isOAuthProviderEnabled(provider);
        if (!enabled) {
          return (
            <p key={provider} className="text-xs text-gray-500 text-center py-2">
              {oauthUnavailableMessage(provider)}
            </p>
          );
        }
        return (
          <button key={provider} type="button" disabled={loading} onClick={() => onOAuth(provider)} className={btnCls}>
            {PROVIDER_LABELS[provider]}
          </button>
        );
      })}
    </div>
  );
}

export default MemberEmailAuthForm;
