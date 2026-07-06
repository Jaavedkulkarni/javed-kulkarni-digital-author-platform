import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { AuthorSettings, AuthorSettingsSection } from '../types/settings.types';

export function useAuthorSettings() {
  const { authorId } = useAuthorContext();
  const { settings } = useAuthorServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: authorQueryKeys.settings(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(settings.get(authorId!)),
    enabled: Boolean(authorId),
  });

  const updateMutation = useMutation({
    mutationFn: <S extends AuthorSettingsSection>(input: {
      section: S;
      patch: Partial<AuthorSettings[S]>;
    }) => Promise.resolve(settings.updateSection(authorId!, input.section, input.patch)),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: authorQueryKeys.settings(authorId!) });
      const previous = queryClient.getQueryData<AuthorSettings>(authorQueryKeys.settings(authorId!));
      if (previous) {
        queryClient.setQueryData(authorQueryKeys.settings(authorId!), {
          ...previous,
          [input.section]: { ...previous[input.section], ...input.patch },
        });
      }
      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(authorQueryKeys.settings(authorId!), context.previous);
      }
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.settings(authorId!) }),
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
