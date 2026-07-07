import { peopleQueryKeys } from '../queries/people.queries';

export const accountSecurityQueryKeys = {
  all: (userId: string) => peopleQueryKeys.security(userId),
  snapshot: (userId: string) => [...peopleQueryKeys.security(userId), 'snapshot'] as const,
  sessions: (userId: string) => peopleQueryKeys.sessions(userId),
};
