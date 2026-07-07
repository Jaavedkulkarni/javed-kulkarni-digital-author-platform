import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReader } from '../../../context/ReaderContext';
import { useAuthModal } from '../../../context/AuthModalContext';
import { detectAuthCallbackType } from '../../../lib/authCallback';
import { resolvePostAuthNavigation } from '../../../lib/authRedirect';
import { setVerifiedEmailPrefill, setEmailAuthTab } from '../../../auth/public/publicAuthIntent';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ReaderVerifyEmailContent() {
  const { user, resendVerificationEmail } = useReader();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(() => detectAuthCallbackType() === 'signup');
  const [verified, setVerified] = useState(!!user?.email_confirmed_at);
  const [redirectScheduled, setRedirectScheduled] = useState(false);

  useEffect(() => {
    if (user?.email_confirmed_at) {
      setVerified(true);
      setProcessing(false);
    }
  }, [user?.email_confirmed_at]);

  useEffect(() => {
    if (!verified || redirectScheduled) return;
    setRedirectScheduled(true);
    const timer = window.setTimeout(() => {
      if (user?.email) {
        setVerifiedEmailPrefill(user.email);
        setEmailAuthTab('sign-in');
      }
      const { shouldNavigate, target } = resolvePostAuthNavigation('/');
      if (shouldNavigate) {
        navigate(target, { replace: true });
      } else {
        navigate('/', { replace: true });
        openAuthModal('email');
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [verified, redirectScheduled, navigate, openAuthModal, user?.email]);

  useEffect(() => {
    if (!processing) return;
    const timer = window.setTimeout(() => setProcessing(false), 10000);
    return () => window.clearTimeout(timer);
  }, [processing]);

  if (processing && !verified) {
    return (
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Verifying your email...</p>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <p className="text-gray-300 text-sm font-medium">Your email has been verified successfully.</p>
        <p className="text-gray-500 text-xs">Redirecting you to the homepage...</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-gold-400 mx-auto" />
      <p className="text-gray-300 text-sm">
        We sent a verification link to your email. Click it to activate your account.
      </p>
      <button type="button" onClick={() => resendVerificationEmail()} className="text-gold-400 hover:text-gold-300 text-sm">
        Resend verification email
      </button>
    </div>
  );
}

export default ReaderVerifyEmailContent;
