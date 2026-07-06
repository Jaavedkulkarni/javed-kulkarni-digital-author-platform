import { useContext, useCallback } from 'react';
import { FeatureFlagContext } from '../contexts/FeatureFlagContext';
import type { CoreFeatureFlag } from '../types/featureFlag.types';

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider.');
  }

  const isEnabled = useCallback(
    (flag: CoreFeatureFlag) => context.isEnabled(flag),
    [context]
  );

  return {
    flags: context.flags,
    engine: context.engine,
    isEnabled,
  };
}
