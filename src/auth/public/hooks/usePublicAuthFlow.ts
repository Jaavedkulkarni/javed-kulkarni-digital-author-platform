import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReader } from '../../../context/ReaderContext';
import { useRoles } from '../../../context/RoleContext';
import { useAuthModal } from '../../../context/AuthModalContext';
import { isAuthor } from '../../../lib/permissions';
import {
  setPublicAuthIntent,
  setEmailAuthTab,
  type PublicAuthIntent,
} from '../publicAuthIntent';

export function usePublicAuthFlow() {
  const { user, loading: readerLoading } = useReader();
  const { roles, loading: rolesLoading } = useRoles();
  const {
    openBecomeAuthorFlow,
    openPublisherRegistrationFlow,
    openAlreadyAuthorNotice,
    openAuthModal,
  } = useAuthModal();
  const navigate = useNavigate();

  const startAuthFlow = useCallback(
    (intent: PublicAuthIntent, emailTab?: 'sign-in' | 'create-account') => {
      setPublicAuthIntent(intent);
      if (emailTab) setEmailAuthTab(emailTab);
      openAuthModal('members-login');
    },
    [openAuthModal],
  );

  const handleBecomeAuthor = useCallback(() => {
    if (readerLoading || rolesLoading) return;

    if (user && isAuthor(roles)) {
      openAlreadyAuthorNotice();
      return;
    }

    if (user) {
      setPublicAuthIntent('become-author');
      openBecomeAuthorFlow();
      return;
    }

    startAuthFlow('become-author', 'create-account');
  }, [
    readerLoading,
    rolesLoading,
    user,
    roles,
    openAlreadyAuthorNotice,
    openBecomeAuthorFlow,
    startAuthFlow,
  ]);

  const handleRegisterPublisher = useCallback(() => {
    if (readerLoading) return;

    if (user) {
      setPublicAuthIntent('publisher-register');
      openPublisherRegistrationFlow();
      return;
    }

    startAuthFlow('publisher-register', 'create-account');
  }, [readerLoading, user, openPublisherRegistrationFlow, startAuthFlow]);

  const handleMembersLogin = useCallback(() => {
    startAuthFlow('members-login');
  }, [startAuthFlow]);

  const goToDashboard = useCallback(() => {
    navigate('/author', { replace: true });
  }, [navigate]);

  return {
    handleMembersLogin,
    handleBecomeAuthor,
    handleRegisterPublisher,
    goToDashboard,
  };
}

export default usePublicAuthFlow;
