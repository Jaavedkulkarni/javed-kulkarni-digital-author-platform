import type { AuthorManagementRecord, AuthorVerificationStatus } from '../types/author.types';
import { generateId } from '../utils/common';

const authors: AuthorManagementRecord[] = [
  { id: generateId('auth'), displayName: 'Javed Kulkarni', email: 'jaavedkulkarni@gmail.com', verificationStatus: 'premium', trustScore: 98, booksPublished: 12, totalRevenue: 450000, activeServices: 2, status: 'active' },
  { id: generateId('auth'), displayName: 'Priya Sharma', email: 'priya@example.com', verificationStatus: 'verified', trustScore: 85, booksPublished: 5, totalRevenue: 120000, activeServices: 0, status: 'active' },
  { id: generateId('auth'), displayName: 'Arun Mehta', email: 'arun@example.com', verificationStatus: 'unverified', trustScore: 60, booksPublished: 1, totalRevenue: 8000, activeServices: 1, status: 'active' },
];

export function getAuthors() { return authors; }

export function updateAuthorVerification(id: string, status: AuthorVerificationStatus): AuthorManagementRecord | null {
  const a = authors.find((x) => x.id === id);
  if (!a) return null;
  a.verificationStatus = status;
  return a;
}

export function suspendAuthor(id: string): AuthorManagementRecord | null {
  const a = authors.find((x) => x.id === id);
  if (!a) return null;
  a.status = 'suspended';
  return a;
}

export function restoreAuthor(id: string): AuthorManagementRecord | null {
  const a = authors.find((x) => x.id === id);
  if (!a) return null;
  a.status = 'active';
  return a;
}
