import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { useAuthModal } from '../../context/AuthModalContext';
import { storeReaderReturnTo } from '../../lib/authRedirect';
import { ReaderForgotPasswordForm } from '../../components/reader/auth/ReaderForgotPasswordForm';
import { ReaderAuthShell } from './ReaderAuthShell';
import { useEffect } from 'react';

export function ReaderForgotPassword() {
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    storeReaderReturnTo();
  }, []);

  return (
    <PublicSiteLayout title="Forgot Password">
      <div className="max-w-md mx-auto">
        <ReaderAuthShell title="Forgot Password" subtitle="Reset link will be sent to your email" embedded>
          <ReaderForgotPasswordForm onBackToSignIn={() => openAuthModal('sign-in')} />
        </ReaderAuthShell>
      </div>
    </PublicSiteLayout>
  );
}

export default ReaderForgotPassword;
