import { createContext } from 'react';
import type { PermissionContextValue } from '../types/guard.types';

export const PermissionContext = createContext<PermissionContextValue | null>(null);
