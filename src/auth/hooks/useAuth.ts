import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  const { state, ...actions } = context;

  return {
    user: state.user,
    session: state.session,
    status: state.status,
    error: state.error,
    pendingVerificationEmail: state.pendingVerificationEmail,
    isAuthenticated: state.status === 'authenticated' && !!state.user,
    isLoading: state.status === 'loading' || !state.isInitialized,
    isInitialized: state.isInitialized,
    ...actions,
  };
}
