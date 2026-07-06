import { useQuery } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { MindWaveAiFeature } from '../ai/types';

export function useMindWaveAi(feature?: MindWaveAiFeature) {
  const { authorId } = useAuthorContext();
  const { mindWaveAi } = useAuthorServices();

  const availabilityQuery = useQuery({
    queryKey: authorQueryKeys.mindWaveAi(authorId ?? 'guest'),
    queryFn: async () => ({
      available: await mindWaveAi.isAvailable(),
      features: mindWaveAi.getSupportedFeatures(),
    }),
    enabled: Boolean(authorId),
  });

  const execute = async (context: Record<string, unknown>, prompt?: string) => {
    if (!authorId || !feature) return null;
    return mindWaveAi.execute({ authorId, feature, context, prompt });
  };

  return {
    features: mindWaveAi.getSupportedFeatures(),
    availability: availabilityQuery.data,
    execute,
    isLoading: availabilityQuery.isLoading,
  };
}
