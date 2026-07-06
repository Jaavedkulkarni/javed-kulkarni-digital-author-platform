export interface CopyrightClaim {
  id: string;
  claimNumber: string;
  contentTitle: string;
  claimant: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
}

export interface DmcaRequest {
  id: string;
  referenceNumber: string;
  contentTitle: string;
  status: 'received' | 'processing' | 'action_taken' | 'closed';
  receivedAt: string;
}

export interface LegalContract {
  id: string;
  partyName: string;
  contractType: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
}

export interface PolicyViolation {
  id: string;
  entityName: string;
  violationType: string;
  status: 'reported' | 'reviewing' | 'actioned' | 'dismissed';
}

export interface LegalDispute {
  id: string;
  disputeNumber: string;
  parties: string;
  status: 'open' | 'mediation' | 'resolved' | 'escalated';
}
