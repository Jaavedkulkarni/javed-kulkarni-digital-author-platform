import { useState } from 'react';
import { useReader } from '../../../context/ReaderContext';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface AuthFormProps {
  onBackToSignIn?: () => void;
  compact?: boolean;
}

export function ReaderForgotPasswordForm({ onBackToSignIn, compact }: AuthFormProps) {
  const { resetPassword } = useReader();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.success) setSent(true);
    else setError(result.error ?? 'Failed to send reset email.');
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <p className="text-gray-300 text-sm">
          If an account exists for {email}, you will receive a password reset link shortly.
        </p>
        {onBackToSignIn && (
          <button type="button" onClick={onBackToSignIn} className="text-gold-400 hover:text-gold-300 text-sm">
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
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`${inputCls} pl-10`} />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {onBackToSignIn && (
        <p className="mt-4 text-center text-gray-500 text-sm">
          <button type="button" onClick={onBackToSignIn} className="text-gold-400 hover:text-gold-300">
            Back to Sign In
          </button>
        </p>
      )}
    </div>
  );
}

export default ReaderForgotPasswordForm;
