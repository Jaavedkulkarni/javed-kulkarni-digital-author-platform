import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { useReader } from '../../context/ReaderContext';
import { resolvePostAuthNavigation } from '../../lib/authRedirect';
import { ReaderVerifyEmailContent } from '../../components/reader/auth/ReaderVerifyEmailContent';
import { ReaderAuthShell } from './ReaderAuthShell';

export function ReaderVerifyEmail() {
  const { user } = useReader();
  const navigate = useNavigate();
  const verified = !!user?.email_confirmed_at;

  useEffect(() => {
    if (verified) {
      const { shouldNavigate, target } = resolvePostAuthNavigation('/');
      if (shouldNavigate) navigate(target, { replace: true });
    }
  }, [verified, navigate]);

  return (
    <PublicSiteLayout title="Verify Email">
      <div className="max-w-md mx-auto">
        <ReaderAuthShell
          title={verified ? 'Email Verified' : 'Verify Your Email'}
          subtitle={verified ? 'Redirecting you back...' : 'Please confirm your email address.'}
          embedded
        >
          <ReaderVerifyEmailContent />
        </ReaderAuthShell>
      </div>
    </PublicSiteLayout>
  );
}

export default ReaderVerifyEmail;
