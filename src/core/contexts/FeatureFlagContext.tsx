import { createContext } from 'react';
import type { CoreFeatureFlag } from '../types/featureFlag.types';
import type { FeatureFlagEngine } from '../feature-flags/featureFlagEngine';

export interface FeatureFlagContextValue {
  engine: FeatureFlagEngine;
  isEnabled: (flag: CoreFeatureFlag) => boolean;
  flags: Readonly<Record<CoreFeatureFlag, boolean>>;
}

export const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);
