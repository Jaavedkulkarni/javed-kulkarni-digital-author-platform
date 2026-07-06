import { useMemo, type ReactNode } from 'react';
import { FeatureFlagContext, type FeatureFlagContextValue } from '../contexts/FeatureFlagContext';
import type { ConfigurationService } from '../config/configurationService';
import { createFeatureFlagEngine } from '../feature-flags/featureFlagEngine';

export interface FeatureFlagProviderProps {
  children: ReactNode;
  config?: ConfigurationService;
  engine?: ReturnType<typeof createFeatureFlagEngine>;
}

export function FeatureFlagProvider({
  children,
  config,
  engine = createFeatureFlagEngine(config),
}: FeatureFlagProviderProps) {
  const value = useMemo<FeatureFlagContextValue>(() => {
    const state = engine.resolveState();
    return {
      engine,
      isEnabled: (flag) => engine.isEnabled(flag),
      flags: state.flags,
    };
  }, [engine]);

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}
