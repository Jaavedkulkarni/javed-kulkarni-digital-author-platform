import type { AuthAction, AuthState } from '../types/auth.types';

export const initialAuthState: AuthState = {
  status: 'idle',
  user: null,
  session: null,
  error: null,
  pendingVerificationEmail: null,
  isInitialized: false,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_INITIALIZE_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'AUTH_INITIALIZE_SUCCESS':
      if (action.payload) {
        return {
          ...state,
          status: 'authenticated',
          user: action.payload.user,
          session: action.payload,
          error: null,
          isInitialized: true,
        };
      }

      return {
        ...state,
        status: 'unauthenticated',
        user: null,
        session: null,
        error: null,
        isInitialized: true,
      };

    case 'AUTH_INITIALIZE_FAILURE':
      return {
        ...state,
        status: 'unauthenticated',
        user: null,
        session: null,
        error: action.payload ?? null,
        isInitialized: true,
      };

    case 'AUTH_LOGIN_START':
    case 'AUTH_REGISTER_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        status: 'authenticated',
        user: action.payload.user,
        session: action.payload,
        error: null,
        pendingVerificationEmail: null,
      };

    case 'AUTH_REGISTER_SUCCESS':
      if (action.payload.session) {
        return {
          ...state,
          status: 'authenticated',
          user: action.payload.session.user,
          session: action.payload.session,
          error: null,
          pendingVerificationEmail: null,
        };
      }

      return {
        ...state,
        status: 'unauthenticated',
        user: null,
        session: null,
        error: null,
        pendingVerificationEmail: action.payload.needsVerification ? action.payload.email : null,
      };

    case 'AUTH_LOGIN_FAILURE':
    case 'AUTH_REGISTER_FAILURE':
      return {
        ...state,
        status: state.session ? 'authenticated' : 'unauthenticated',
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
    case 'AUTH_SESSION_EXPIRED':
      return {
        ...state,
        status: 'unauthenticated',
        user: null,
        session: null,
        error: null,
        pendingVerificationEmail: null,
      };

    case 'AUTH_REFRESH_SUCCESS':
      return {
        ...state,
        status: 'authenticated',
        user: action.payload.user,
        session: action.payload,
        error: null,
      };

    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'AUTH_SET_PENDING_VERIFICATION':
      return {
        ...state,
        pendingVerificationEmail: action.payload,
      };

    default:
      return state;
  }
}
