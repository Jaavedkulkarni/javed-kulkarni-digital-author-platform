import type { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthProvider';

export function AppAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default AppAuthProvider;
