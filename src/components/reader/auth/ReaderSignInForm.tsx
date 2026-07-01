import { useState } from 'react';
import { useReader } from '../../../context/ReaderContext';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface AuthFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  compact?: boolean;
}

export function ReaderSignInForm({ onSuccess, onForgotPassword, onSignUp, compact }: AuthFormProps) {
  const { signIn } = useReader();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error ?? 'Sign in failed.');
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
      <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className={`${inputCls} pl-10`}
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputCls} pl-10 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <button type="button" onClick={onForgotPassword} className="text-sm text-gold-400 hover:text-gold-300">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {onSignUp && (
        <p className="mt-4 text-center text-gray-500 text-sm">
          New reader?{' '}
          <button type="button" onClick={onSignUp} className="text-gold-400 hover:text-gold-300">
            Sign Up
          </button>
        </p>
      )}
    </div>
  );
}

export default ReaderSignInForm;
