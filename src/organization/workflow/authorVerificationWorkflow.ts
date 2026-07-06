import type { AuthorVerificationStatus } from '../types/verification.types';

const TRANSITIONS: Record<AuthorVerificationStatus, AuthorVerificationStatus[]> = {
  unverified: ['verified', 'suspended'],
  verified: ['premium', 'suspended'],
  premium: ['suspended'],
  suspended: ['verified', 'unverified'],
};

export function canTransitionAuthorVerification(
  current: AuthorVerificationStatus,
  next: AuthorVerificationStatus
): boolean {
  return TRANSITIONS[current]?.includes(next) ?? false;
}

export function getNextAuthorVerificationStatuses(
  current: AuthorVerificationStatus
): AuthorVerificationStatus[] {
  return TRANSITIONS[current] ?? [];
}
