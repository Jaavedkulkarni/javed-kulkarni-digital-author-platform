import { useContext } from 'react';
import { CoreContext, type CoreContextValue } from '../contexts/CoreContext';

export function useCore(): CoreContextValue {
  const context = useContext(CoreContext);
  if (!context) {
    throw new Error('useCore must be used within AppProvider.');
  }
  return context;
}

export function useServiceContainer() {
  return useCore().container;
}

export function useConfiguration() {
  return useCore().config;
}

export function useModuleRegistry() {
  return useCore().modules;
}

export function useApplicationRegistry() {
  return useCore().applications;
}

export function useGlobalErrorHandler() {
  return useCore().errors;
}
