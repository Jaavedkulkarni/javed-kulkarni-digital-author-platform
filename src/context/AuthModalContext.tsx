import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import { ReaderSignInForm } from '../components/reader/auth/ReaderSignInForm';
import { ReaderSignUpForm } from '../components/reader/auth/ReaderSignUpForm';
import { ReaderForgotPasswordForm } from '../components/reader/auth/ReaderForgotPasswordForm';
import { storeReaderReturnTo, resolvePostAuthNavigation } from '../lib/authRedirect';

export type AuthModalView = 'sign-in' | 'sign-up' | 'forgot-password';

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthModalView | null;
  openAuthModal: (view: AuthModalView) => void;
  closeAuthModal: () => void;
  completeAuthSuccess: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

const MODAL_TITLES: Record<AuthModalView, string> = {
  'sign-in': 'Sign In',
  'sign-up': 'Sign Up',
  'forgot-password': 'Forgot Password',
};

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthModalView | null>(null);

  const closeAuthModal = useCallback(() => {
    setView(null);
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

  return (
    <AuthModalContext.Provider
      value={{
        isOpen: view !== null,
        view,
        openAuthModal,
        closeAuthModal,
        completeAuthSuccess,
      }}
    >
      {children}
      {view && (
        <Modal title={MODAL_TITLES[view]} onClose={closeAuthModal}>
          {view === 'sign-in' && (
            <ReaderSignInForm
              compact
              onSuccess={completeAuthSuccess}
              onForgotPassword={() => setView('forgot-password')}
              onSignUp={() => setView('sign-up')}
            />
          )}
          {view === 'sign-up' && (
            <ReaderSignUpForm
              compact
              onSuccess={completeAuthSuccess}
              onSignIn={() => setView('sign-in')}
            />
          )}
          {view === 'forgot-password' && (
            <ReaderForgotPasswordForm compact onBackToSignIn={() => setView('sign-in')} />
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
