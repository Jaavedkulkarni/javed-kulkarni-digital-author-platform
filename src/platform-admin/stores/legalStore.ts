import type { CopyrightClaim, DmcaRequest, LegalContract, PolicyViolation, LegalDispute } from '../types/legal.types';
import { generateId } from '../utils/permissions';

const claims: CopyrightClaim[] = [
  { id: generateId('cc'), claimNumber: 'CC-001', contentTitle: 'Shared Passage Book', claimant: 'Rights Corp', status: 'open' },
];
const dmca: DmcaRequest[] = [
  { id: generateId('dm'), referenceNumber: 'DMCA-101', contentTitle: 'Infringing Article', status: 'received', receivedAt: new Date().toISOString() },
];
const contracts: LegalContract[] = [
  { id: generateId('lc'), partyName: 'PrintCo Publishers', contractType: 'Production Partner', status: 'active' },
];
const violations: PolicyViolation[] = [
  { id: generateId('pv'), entityName: 'User Report #45', violationType: 'Content Policy', status: 'reviewing' },
];
const disputes: LegalDispute[] = [
  { id: generateId('ld'), disputeNumber: 'DISP-001', parties: 'Author vs. Third Party', status: 'open' },
];

export function getCopyrightClaims() { return claims; }
export function getDmcaRequests() { return dmca; }
export function getContracts() { return contracts; }
export function getPolicyViolations() { return violations; }
export function getDisputes() { return disputes; }
