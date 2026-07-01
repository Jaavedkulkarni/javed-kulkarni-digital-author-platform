import { useState } from 'react';
import { useReader } from '../../../context/ReaderContext';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface AuthFormProps {
  onSuccess?: () => void;
  onSignIn?: () => void;
  compact?: boolean;
}

export function ReaderSignUpForm({ onSuccess, onSignIn, compact }: AuthFormProps) {
  const { signUp } = useReader();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signUp({ email, password, full_name: fullName, display_name: fullName });
    setLoading(false);
    if (result.success) {
      if (result.needsVerification) {
        setVerificationSent(true);
      } else {
        onSuccess?.();
      }
    } else {
      setError(result.error ?? 'Sign up failed.');
    }
  };

  if (verificationSent) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <p className="text-gray-300 text-sm">
          Check your inbox at <strong className="text-white">{email}</strong> and click the link to activate your reader account.
        </p>
        {onSignIn && (
          <button type="button" onClick={onSignIn} className="text-gold-400 hover:text-gold-300 text-sm">
            Back to Sign In
          </button>
        )}
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
      <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={`${inputCls} pl-10`}
              placeholder="Min. 8 characters"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      {onSignIn && (
        <p className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <button type="button" onClick={onSignIn} className="text-gold-400 hover:text-gold-300">
            Sign In
          </button>
        </p>
      )}
    </div>
  );
}

export default ReaderSignUpForm;
