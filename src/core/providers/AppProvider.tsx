import { useMemo, type ReactNode } from 'react';
import type { CoreRole } from '../types/permission.types';
import type { CoreEnvironmentConfig } from '../types/config.types';
import { CoreContext, type CoreContextValue } from '../contexts/CoreContext';
import { PermissionProvider } from './PermissionProvider';
import { FeatureFlagProvider } from './FeatureFlagProvider';
import { createCoreFoundation, type CreateCoreFoundationOptions } from '../app/createCoreFoundation';

export interface AppProviderProps extends CreateCoreFoundationOptions {
  children: ReactNode;
  roles?: CoreRole[];
  config?: Partial<CoreEnvironmentConfig>;
}

export function AppProvider({ children, roles = [], config, ...options }: AppProviderProps) {
  const foundation = useMemo(
    () => createCoreFoundation({ ...options, config }),
    // Foundation is intentionally initialized once per provider mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const coreValue = useMemo<CoreContextValue>(
    () => ({
      foundation: foundation.foundation,
      config: foundation.config,
      permissions: foundation.permissions,
      featureFlags: foundation.featureFlags,
      events: foundation.events,
      modules: foundation.modules,
      applications: foundation.applications,
      container: foundation.container,
      errors: foundation.errors,
    }),
    [foundation]
  );

  return (
    <CoreContext.Provider value={coreValue}>
      <FeatureFlagProvider config={foundation.config} engine={foundation.featureFlags}>
        <PermissionProvider roles={roles} engine={foundation.permissions}>
          {children}
        </PermissionProvider>
      </FeatureFlagProvider>
    </CoreContext.Provider>
  );
}
