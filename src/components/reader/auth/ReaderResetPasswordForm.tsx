import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useReader } from '../../../context/ReaderContext';
import { resolvePostAuthNavigation } from '../../../lib/authRedirect';
import { detectAuthCallbackType } from '../../../lib/authCallback';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface ResetPasswordFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export function ReaderResetPasswordForm({ onSuccess, compact }: ResetPasswordFormProps) {
  const { updatePassword } = useReader();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const hasRecoveryCallback = detectAuthCallbackType() === 'recovery';

    async function waitForRecoverySession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        setReady(true);
        return;
      }

      if (!hasRecoveryCallback) {
        setInitError('Open the reset link from your email to set a new password.');
        return;
      }

      const timeout = window.setTimeout(() => {
        if (!cancelled) {
          setInitError('Could not establish a recovery session. Please request a new reset link.');
        }
      }, 8000);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
        if (event === 'PASSWORD_RECOVERY' || nextSession) {
          window.clearTimeout(timeout);
          setReady(true);
          setInitError(null);
        }
      });

      return () => {
        window.clearTimeout(timeout);
        subscription.unsubscribe();
      };
    }

    const cleanupPromise = waitForRecoverySession();
    return () => {
      cancelled = true;
      void cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  const finishSuccess = () => {
    setDone(true);
    if (onSuccess) {
      setTimeout(onSuccess, 1200);
      return;
    }
    setTimeout(() => {
      const { shouldNavigate, target } = resolvePostAuthNavigation('/');
      if (shouldNavigate) navigate(target, { replace: true });
    }, 1200);
  };

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
      finishSuccess();
    } else {
      setError(result.error ?? 'Could not reset password.');
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <p className="text-gray-300 text-sm font-medium">Password updated successfully.</p>
        <p className="text-gray-500 text-xs">You are signed in. Returning you to where you left off...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-gray-300 text-sm">{initError}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Verifying your recovery link...</p>
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
          <label className="block text-sm text-gray-300 mb-2">New Password</label>
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
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Password'}
        </button>
      </form>
    </div>
  );
}

export default ReaderResetPasswordForm;
