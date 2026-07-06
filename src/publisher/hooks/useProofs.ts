import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publisherQueryKeys } from '../query/queryKeys';
import { usePublisherServices } from './usePublisherServices';
import { usePublisherContext } from './usePublisherContext';
import type { ProofUpload } from '../types/proof.types';

export function useProofs() {
  const { publisherId } = usePublisherContext();
  const { proofs } = usePublisherServices();

  const query = useQuery({
    queryKey: publisherQueryKeys.proofs(publisherId ?? 'guest'),
    queryFn: () => proofs.list(publisherId!),
    enabled: Boolean(publisherId),
  });

  return { proofPackages: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}

export function useProofMutations() {
  const { publisherId } = usePublisherContext();
  const { proofs } = usePublisherServices();
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: publisherQueryKeys.proofs(publisherId ?? 'guest') });
  };

  const uploadMutation = useMutation({
    mutationFn: ({ jobId, type, filename }: { jobId: string; type: ProofUpload['type']; filename: string }) =>
      proofs.uploadProof(publisherId!, jobId, type, filename),
    onSuccess: invalidate,
  });

  const submitApprovalMutation = useMutation({
    mutationFn: (jobId: string) => proofs.submitForApproval(publisherId!, jobId),
    onSuccess: invalidate,
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ jobId, content }: { jobId: string; content: string }) =>
      proofs.addNote(publisherId!, jobId, content),
    onSuccess: invalidate,
  });

  return { uploadMutation, submitApprovalMutation, addNoteMutation };
}
