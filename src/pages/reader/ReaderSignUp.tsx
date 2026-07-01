import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { useAuthModal } from '../../context/AuthModalContext';
import { useReader } from '../../context/ReaderContext';
import { resolvePostAuthNavigation } from '../../lib/authRedirect';
import { ReaderSignUpForm } from '../../components/reader/auth/ReaderSignUpForm';
import { ReaderAuthShell } from './ReaderAuthShell';

export function ReaderSignUp() {
  const { openAuthModal } = useAuthModal();
  const { isReaderAuthenticated } = useReader();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReaderAuthenticated) {
      const { shouldNavigate, target } = resolvePostAuthNavigation('/');
      if (shouldNavigate) navigate(target, { replace: true });
    }
  }, [isReaderAuthenticated, navigate]);

  if (isReaderAuthenticated) return null;

  return (
    <PublicSiteLayout title="Sign Up">
      <div className="max-w-md mx-auto">
        <ReaderAuthShell title="Sign Up" subtitle="वाचक खाते तयार करा" embedded>
          <ReaderSignUpForm
            onSuccess={() => {
              const { shouldNavigate, target } = resolvePostAuthNavigation('/');
              if (shouldNavigate) navigate(target, { replace: true });
            }}
            onSignIn={() => openAuthModal('sign-in')}
          />
        </ReaderAuthShell>
      </div>
    </PublicSiteLayout>
  );
}

export default ReaderSignUp;
