import { useQuery } from '@tanstack/react-query';
import { superAdminQueryKeys } from '../query/queryKeys';
import { useSuperAdminServices } from './useSuperAdminServices';

export function useSecurity() {
  const { security, audit } = useSuperAdminServices();
  const query = useQuery({
    queryKey: superAdminQueryKeys.security(),
    queryFn: () => ({ audit: audit.list(), sessions: security.getActiveSessions() }),
  });
  return { auditLog: query.data?.audit ?? [], sessions: query.data?.sessions ?? [], isLoading: query.isLoading };
}
