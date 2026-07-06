import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { mapMembershipToMockRecord } from '../mappers/membership.mapper';
import type { MockMembershipRecord } from '../../data/mockMembership';

export async function fetchMembership(userId: string): Promise<MockMembershipRecord> {
  const { readerRepositories } = getReaderDataAccess();
  const membership = await withRetry(
    async () => readerRepositories.memberships.findActiveByUser(userId),
    { scope: 'reader.membership.fetch' }
  );
  return mapMembershipToMockRecord(membership);
}
