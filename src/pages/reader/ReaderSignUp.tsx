import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useReader } from '../../context/ReaderContext';
import { ReaderAuthShell, inputCls } from './ReaderAuthShell';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ReaderSignUp() {
  const { signUp, isReaderAuthenticated } = useReader();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  if (isReaderAuthenticated) {
    return <Navigate to="/reader" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signUp({ email, password, full_name: fullName, display_name: fullName });
    setLoading(false);
    if (result.success) {
      setVerificationSent(!!result.needsVerification);
    } else {
      setError(result.error ?? 'Sign up failed.');
    }
  };

  if (verificationSent) {
    return (
      <ReaderAuthShell title="Verify Your Email" subtitle="आम्ही तुम्हाला verification link पाठवली आहे.">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-gray-300 text-sm">Check your inbox at <strong className="text-white">{email}</strong> and click the link to activate your reader account.</p>
          <Link to="/reader/sign-in" className="inline-block text-gold-400 hover:text-gold-300 text-sm">Back to Sign In</Link>
        </div>
      </ReaderAuthShell>
    );
  }

  return (
    <ReaderAuthShell title="Sign Up" subtitle="वाचक खाते तयार करा">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
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
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={`${inputCls} pl-10`} placeholder="Min. 8 characters" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50">
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-500 text-sm">
        Already have an account?{' '}
        <Link to="/reader/sign-in" className="text-gold-400 hover:text-gold-300">Sign In</Link>
      </p>
    </ReaderAuthShell>
  );
}

export default ReaderSignUp;
