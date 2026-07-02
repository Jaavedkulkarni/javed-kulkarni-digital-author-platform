import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import { MemberEmailAuthForm, SocialAuthButtons } from '../components/reader/auth/MemberAuthModalContent';
import { ReaderForgotPasswordForm } from '../components/reader/auth/ReaderForgotPasswordForm';
import { useReader } from './ReaderContext';
import { storeReaderReturnTo, resolvePostAuthNavigation } from '../lib/authRedirect';
import { isProviderNotEnabledError, oauthUnavailableMessage } from '../lib/oauthConfig';
import type { OAuthProvider } from '../lib/oauthConfig';

export type AuthModalView = 'members-login' | 'email' | 'forgot-password';

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthModalView | null;
  openMembersLogin: () => void;
  openAuthModal: (view: AuthModalView) => void;
  closeAuthModal: () => void;
  completeAuthSuccess: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { signInWithOAuth } = useReader();
  const [view, setView] = useState<AuthModalView | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const closeAuthModal = useCallback(() => {
    setView(null);
    setOauthLoading(false);
    setOauthError(null);
  }, []);

  const completeAuthSuccess = useCallback(() => {
    const { shouldNavigate, target } = resolvePostAuthNavigation('/');
    closeAuthModal();
    if (shouldNavigate) {
      navigate(target, { replace: true });
    }
  }, [closeAuthModal, navigate]);

  const openAuthModal = useCallback((nextView: AuthModalView) => {
    storeReaderReturnTo();
    setView(nextView);
  }, []);

  const openMembersLogin = useCallback(() => {
    openAuthModal('members-login');
  }, [openAuthModal]);

  const handleOAuth = async (provider: OAuthProvider) => {
    storeReaderReturnTo();
    setOauthError(null);
    setOauthLoading(true);
    const result = await signInWithOAuth(provider);
    if (!result.success) {
      setOauthLoading(false);
      if (result.error && isProviderNotEnabledError(result.error)) {
        setOauthError(oauthUnavailableMessage(provider));
      } else {
        setOauthError(result.error ?? 'Social sign-in failed. Please try again.');
      }
    }
  };

  const modalTitle =
    view === 'forgot-password'
      ? 'Forgot Password'
      : view === 'email'
        ? 'Continue with Email'
        : 'Members Login';

  return (
    <AuthModalContext.Provider
      value={{
        isOpen: view !== null,
        view,
        openMembersLogin,
        openAuthModal,
        closeAuthModal,
        completeAuthSuccess,
      }}
    >
      {children}
      {view && (
        <Modal title={modalTitle} onClose={closeAuthModal}>
          {view === 'members-login' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm text-center">
                Sign in to your member account or create one in a few steps.
              </p>
              <SocialAuthButtons onOAuth={handleOAuth} loading={oauthLoading} oauthError={oauthError} />
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-navy-600" />
                </div>
                <p className="relative text-center text-xs text-gray-500">
                  <span className="bg-navy-800 px-2">or</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView('email')}
                className="w-full py-3 rounded-lg border border-gold-500/40 text-gold-400 font-semibold hover:bg-gold-500/10 transition-colors"
              >
                Continue with Email
              </button>
            </div>
          )}
          {view === 'email' && (
            <MemberEmailAuthForm
              onSuccess={completeAuthSuccess}
              onForgotPassword={() => setView('forgot-password')}
            />
          )}
          {view === 'forgot-password' && (
            <ReaderForgotPasswordForm compact onBackToSignIn={() => setView('email')} />
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
