import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useReader } from '../../context/ReaderContext';
import { ReaderAuthShell, inputCls } from './ReaderAuthShell';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ReaderResetPassword() {
  const { updatePassword } = useReader();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.success) {
      setDone(true);
      setTimeout(() => navigate('/reader/sign-in'), 2000);
    } else {
      setError(result.error ?? 'Could not reset password.');
    }
  };

  if (done) {
    return (
      <ReaderAuthShell title="Password Updated">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-gray-300 text-sm">Your password has been updated. Redirecting to Sign In...</p>
        </div>
      </ReaderAuthShell>
    );
  }

  if (!ready) {
    return (
      <ReaderAuthShell title="Reset Password">
        <p className="text-gray-400 text-sm text-center">Open the reset link from your email to set a new password.</p>
        <p className="mt-4 text-center">
          <Link to="/reader/forgot-password" className="text-gold-400 text-sm">Request a new link</Link>
        </p>
      </ReaderAuthShell>
    );
  }

  return (
    <ReaderAuthShell title="Set New Password">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-300 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={`${inputCls} pl-10`} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} className={`${inputCls} pl-10`} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </ReaderAuthShell>
  );
}

export default ReaderResetPassword;
