import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicSiteLayout } from '../../components/layout/PublicSiteLayout';
import { useAuthModal } from '../../context/AuthModalContext';
import { useReader } from '../../context/ReaderContext';
import { resolvePostAuthNavigation } from '../../lib/authRedirect';
import { ReaderSignInForm } from '../../components/reader/auth/ReaderSignInForm';
import { ReaderAuthShell } from './ReaderAuthShell';

/** Deep-link fallback for bookmarks and external links. */
export function ReaderSignIn() {
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
    <PublicSiteLayout title="Sign In">
      <div className="max-w-md mx-auto">
        <ReaderAuthShell title="Sign In" subtitle="वाचक खात्यात प्रवेश करा" embedded>
          <ReaderSignInForm
            onSuccess={() => {
              const { shouldNavigate, target } = resolvePostAuthNavigation('/');
              if (shouldNavigate) navigate(target, { replace: true });
            }}
            onForgotPassword={() => openAuthModal('forgot-password')}
            onSignUp={() => openAuthModal('sign-up')}
          />
        </ReaderAuthShell>
      </div>
    </PublicSiteLayout>
  );
}

export default ReaderSignIn;
