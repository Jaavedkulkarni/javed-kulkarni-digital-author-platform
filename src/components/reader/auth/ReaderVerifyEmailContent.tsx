import { useReader } from '../../../context/ReaderContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ReaderVerifyEmailContent() {
  const { user, resendVerificationEmail } = useReader();
  const verified = !!user?.email_confirmed_at;

  if (verified) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <p className="text-gray-300 text-sm">Email verified. Taking you back to where you left off...</p>
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
