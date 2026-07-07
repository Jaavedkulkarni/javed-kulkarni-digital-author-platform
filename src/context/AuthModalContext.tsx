import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import { MemberEmailAuthForm } from '../components/reader/auth/MemberAuthModalContent';
import { ReaderForgotPasswordForm } from '../components/reader/auth/ReaderForgotPasswordForm';
import { useBootstrap } from '../auth/bootstrap/hooks';
import { storeReaderReturnTo } from '../lib/authRedirect';
import { isAuthor } from '../lib/permissions';
import {
  setPublicAuthIntent,
  peekPublicAuthIntent,
  clearPublicAuthIntent,
  consumeEmailAuthTab,
  consumeVerifiedEmailPrefill,
  type PublicAuthIntent,
  type EmailAuthTab,
} from '../auth/public/publicAuthIntent';
import { resolvePostLoginRoute } from '../auth/routing/resolvePostLoginRoute';
import { AuthorOnboardingPanel } from '../auth/public/components/AuthorOnboardingPanel';
import { AlreadyAuthorNotice } from '../auth/public/components/AlreadyAuthorNotice';
import { PublisherRegistrationWizard } from '../auth/public/components/PublisherRegistrationWizard';
import { PublisherPendingApprovalPanel } from '../auth/public/components/PublisherPendingApprovalPanel';

export type AuthModalView =
  | 'members-login'
  | 'email'
  | 'forgot-password'
  | 'author-onboarding'
  | 'already-author'
  | 'publisher-registration'
  | 'publisher-pending';

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthModalView | null;
  openMembersLogin: () => void;
  openAuthModal: (view: AuthModalView) => void;
  openBecomeAuthorFlow: () => void;
  openPublisherRegistrationFlow: () => void;
  openAlreadyAuthorNotice: () => void;
  closeAuthModal: () => void;
  completeAuthSuccess: () => Promise<void>;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { refresh: refreshBootstrap } = useBootstrap();
  const [view, setView] = useState<AuthModalView | null>(null);
  const [emailTab, setEmailTab] = useState<EmailAuthTab>('sign-in');
  const [prefillEmail, setPrefillEmail] = useState<string | null>(null);

  const closeAuthModal = useCallback(() => {
    if (view === 'members-login' || view === 'email' || view === 'forgot-password') {
      clearPublicAuthIntent();
    }
    setView(null);
    setPrefillEmail(null);
  }, [view]);

  const navigateToDashboard = useCallback(
    async () => {
      const dashboardPath = await resolvePostLoginRoute(refreshBootstrap);
      clearPublicAuthIntent();
      closeAuthModal();
      if (dashboardPath !== window.location.pathname) {
        navigate(dashboardPath, { replace: true });
      }
    },
    [closeAuthModal, navigate, refreshBootstrap],
  );

  const continueAfterAuth = useCallback(
    async (intent: PublicAuthIntent | null) => {
      const payload = await refreshBootstrap();

      if (intent === 'become-author') {
        const freshRoles = payload?.assignedRoles ?? [];
        if (isAuthor(freshRoles)) {
          setView('already-author');
          return;
        }
        setView('author-onboarding');
        return;
      }

      if (intent === 'publisher-register') {
        setView('publisher-registration');
        return;
      }

      await navigateToDashboard();
    },
    [navigateToDashboard, refreshBootstrap],
  );

  const completeAuthSuccess = useCallback(async () => {
    const intent = peekPublicAuthIntent();
    await continueAfterAuth(intent);
  }, [continueAfterAuth]);

  const openAuthModal = useCallback((nextView: AuthModalView) => {
    storeReaderReturnTo();
    if (nextView === 'email') {
      const tab = consumeEmailAuthTab();
      setEmailTab(tab);
      const verifiedEmail = consumeVerifiedEmailPrefill();
      if (verifiedEmail) setPrefillEmail(verifiedEmail);
    }
    setView(nextView);
  }, []);

  const openMembersLogin = useCallback(() => {
    setPublicAuthIntent('members-login');
    openAuthModal('members-login');
  }, [openAuthModal]);

  const openBecomeAuthorFlow = useCallback(() => {
    setPublicAuthIntent('become-author');
    storeReaderReturnTo();
    setView('author-onboarding');
  }, []);

  const openPublisherRegistrationFlow = useCallback(() => {
    setPublicAuthIntent('publisher-register');
    storeReaderReturnTo();
    setView('publisher-registration');
  }, []);

  const openAlreadyAuthorNotice = useCallback(() => {
    storeReaderReturnTo();
    setView('already-author');
  }, []);

  const modalTitle = (() => {
    switch (view) {
      case 'forgot-password':
        return 'Forgot Password';
      case 'email':
        return 'Continue with Email';
      case 'author-onboarding':
        return 'Become an Author';
      case 'already-author':
        return 'Become an Author';
      case 'publisher-registration':
        return 'Register as Publisher';
      case 'publisher-pending':
        return 'Registration Submitted';
      default:
        return 'Members Login';
    }
  })();

  const modalWidth = view === 'publisher-registration' ? 'lg' : 'md';

  return (
    <AuthModalContext.Provider
      value={{
        isOpen: view !== null,
        view,
        openMembersLogin,
        openAuthModal,
        openBecomeAuthorFlow,
        openPublisherRegistrationFlow,
        openAlreadyAuthorNotice,
        closeAuthModal,
        completeAuthSuccess,
      }}
    >
      {children}
      {view && (
        <Modal title={modalTitle} onClose={closeAuthModal} maxWidth={modalWidth}>
          {view === 'members-login' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm text-center">
                Sign in to your member account or create one in a few steps.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal('email')}
                className="w-full py-3 rounded-lg border border-gold-500/40 text-gold-400 font-semibold hover:bg-gold-500/10 transition-colors"
              >
                Continue with Email
              </button>
            </div>
          )}
          {view === 'email' && (
            <MemberEmailAuthForm
              defaultTab={emailTab}
              prefillEmail={prefillEmail}
              onSuccess={completeAuthSuccess}
              onForgotPassword={() => setView('forgot-password')}
            />
          )}
          {view === 'forgot-password' && (
            <ReaderForgotPasswordForm compact onBackToSignIn={() => setView('email')} />
          )}
          {view === 'author-onboarding' && (
            <AuthorOnboardingPanel
              onComplete={() => void navigateToDashboard()}
              onCancel={closeAuthModal}
            />
          )}
          {view === 'already-author' && (
            <AlreadyAuthorNotice onGoToDashboard={() => void navigateToDashboard()} />
          )}
          {view === 'publisher-registration' && (
            <PublisherRegistrationWizard
              onSubmitted={() => {
                clearPublicAuthIntent();
                setView('publisher-pending');
              }}
              onCancel={closeAuthModal}
            />
          )}
          {view === 'publisher-pending' && (
            <PublisherPendingApprovalPanel onClose={closeAuthModal} />
          )}
        </Modal>
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}
