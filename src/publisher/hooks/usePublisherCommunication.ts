import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';

export function usePublisherCommunication(jobId?: string) {
  const { publisherId } = usePublisherContext();
  const { communication } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.communication(publisherId ?? 'guest', jobId),
    queryFn: () => ({
      comments: communication.getComments(publisherId!, jobId),
      updates: communication.getUpdates(publisherId!, jobId),
      attachments: jobId ? communication.getAttachments(publisherId!, jobId) : [],
    }),
    enabled: Boolean(publisherId),
  });

  return {
    comments: query.data?.comments ?? [],
    updates: query.data?.updates ?? [],
    attachments: query.data?.attachments ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useCommunicationMutations() {
  const { publisherId } = usePublisherContext();
  const { communication } = usePublisherServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: [...publisherQueryKeys.all, 'communication', publisherId ?? 'guest'] });
  };

  const addCommentMutation = useMutation({
    mutationFn: ({ jobId, content, isInternal }: { jobId: string; content: string; isInternal?: boolean }) =>
      communication.addComment(publisherId!, jobId, content, isInternal ?? false),
    onSuccess: invalidate,
  });

  const postUpdateMutation = useMutation({
    mutationFn: ({ jobId, message }: { jobId: string; message: string }) =>
      communication.postUpdate(publisherId!, jobId, message),
    onSuccess: invalidate,
  });

  const addAttachmentMutation = useMutation({
    mutationFn: ({ jobId, filename }: { jobId: string; filename: string }) =>
      communication.addAttachment(publisherId!, jobId, filename),
    onSuccess: invalidate,
  });

  return { addCommentMutation, postUpdateMutation, addAttachmentMutation };
}
