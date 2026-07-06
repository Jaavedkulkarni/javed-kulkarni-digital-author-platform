import {
  getCopyrightClaims,
  getDmcaRequests,
  getContracts,
  getPolicyViolations,
  getDisputes,
} from '../stores/legalStore';

export class LegalService {
  getCopyrightClaims() { return getCopyrightClaims(); }
  getDmcaRequests() { return getDmcaRequests(); }
  getContracts() { return getContracts(); }
  getPolicyViolations() { return getPolicyViolations(); }
  getDisputes() { return getDisputes(); }
}

export function createLegalService(): LegalService {
  return new LegalService();
}
