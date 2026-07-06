import { useQuery } from '@tanstack/react-query';
import { organizationQueryKeys } from '../query/queryKeys';
import { useOrganizationServices } from './useOrganizationServices';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import type { AuditEventType } from '../types/audit.types';

export function useAudit(filters?: {
  organizationId?: string;
  eventType?: AuditEventType;
  limit?: number;
}) {
  const { audit } = useOrganizationServices();
  const { profile } = useAppRoles();
  const filterKey = JSON.stringify(filters ?? {});

  const query = useQuery({
    queryKey: organizationQueryKeys.audit(filterKey),
    queryFn: () =>
      audit.list({
        actorId: filters?.organizationId ? undefined : profile?.id,
        organizationId: filters?.organizationId,
        eventType: filters?.eventType,
        limit: filters?.limit ?? 50,
      }),
    enabled: Boolean(profile?.id),
  });

  return { logs: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}
