import type { PeopleRecord, PeopleFilters } from '../types/people.types';
import { generateId } from '../utils/common';

const people: PeopleRecord[] = [
  { id: generateId('p'), type: 'reader', name: 'Amit Shah', email: 'amit@example.com', status: 'active', verified: true, createdAt: new Date().toISOString() },
  { id: generateId('p'), type: 'author', name: 'Javed Kulkarni', email: 'jaavedkulkarni@gmail.com', status: 'verified', verified: true, createdAt: new Date().toISOString() },
  { id: generateId('p'), type: 'publisher', name: 'PrintCo India', email: 'ops@printco.in', status: 'pending', verified: false, createdAt: new Date().toISOString() },
  { id: generateId('p'), type: 'platform_admin', name: 'Ops Lead', email: 'ops@authoros.com', status: 'active', verified: true, createdAt: new Date().toISOString() },
  { id: generateId('p'), type: 'organization', name: 'AuthorOS Platform', email: 'platform@authoros.com', status: 'active', verified: true, createdAt: new Date().toISOString() },
];

export function getPeople(filters: PeopleFilters = {}): PeopleRecord[] {
  return people.filter((p) => {
    if (filters.type && p.type !== filters.type) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.verified !== undefined && p.verified !== filters.verified) return false;
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) && !p.email.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function suspendPerson(id: string): PeopleRecord | null {
  const p = people.find((x) => x.id === id);
  if (!p) return null;
  p.status = 'suspended';
  return p;
}

export function restorePerson(id: string): PeopleRecord | null {
  const p = people.find((x) => x.id === id);
  if (!p) return null;
  p.status = 'active';
  return p;
}

export function exportPeople(filters: PeopleFilters = {}): PeopleRecord[] {
  return getPeople(filters);
}
