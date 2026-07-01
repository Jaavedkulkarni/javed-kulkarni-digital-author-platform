import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useReader } from '../../context/ReaderContext';
import { consumeReaderReturnTo } from '../../lib/authRedirect';
import { ReaderAuthShell } from './ReaderAuthShell';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function ReaderVerifyEmail() {
  const { user, resendVerificationEmail } = useReader();
  const navigate = useNavigate();
  const verified = !!user?.email_confirmed_at;

  useEffect(() => {
    if (verified) {
      navigate(consumeReaderReturnTo('/'), { replace: true });
    }
  }, [verified, navigate]);

  const handleResend = async () => {
    await resendVerificationEmail();
  };

  return (
    <ReaderAuthShell
      title={verified ? 'Email Verified' : 'Verify Your Email'}
      subtitle={verified ? 'Redirecting you back...' : 'Please confirm your email address.'}
    >
      <div className="text-center space-y-4">
        {verified ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-gray-300 text-sm">Taking you back to where you left off...</p>
          </>
        ) : (
          <>
            <AlertCircle className="w-12 h-12 text-gold-400 mx-auto" />
            <p className="text-gray-300 text-sm">We sent a verification link to your email. Click it to activate your account.</p>
            <button type="button" onClick={handleResend} className="text-gold-400 hover:text-gold-300 text-sm">
              Resend verification email
            </button>
            <p className="pt-2">
              <Link to="/reader/sign-in" className="text-gray-500 hover:text-white text-sm">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </ReaderAuthShell>
  );
}

export default ReaderVerifyEmail;
