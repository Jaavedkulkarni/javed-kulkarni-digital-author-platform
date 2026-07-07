import type { ReactNode } from 'react';
import { CommerceProvider } from './CommerceProvider';

export function CommerceModuleProvider({ children }: { children: ReactNode }) {
  return <CommerceProvider>{children}</CommerceProvider>;
}
