import { createContext } from 'react';
import type { CommerceServices } from '../services';

export interface CommerceContextValue {
  services: CommerceServices;
}

export const CommerceContext = createContext<CommerceContextValue | null>(null);
