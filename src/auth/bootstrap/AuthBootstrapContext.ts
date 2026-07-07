import { createContext } from 'react';
import type { AuthBootstrapPayload, AuthBootstrapState } from './auth-bootstrap.types';

export interface AuthBootstrapContextValue extends AuthBootstrapState {
  refresh: () => Promise<AuthBootstrapPayload | null>;
  clear: () => void;
}

export const AuthBootstrapContext = createContext<AuthBootstrapContextValue | null>(null);

export default AuthBootstrapContext;
