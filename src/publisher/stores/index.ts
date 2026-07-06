export * from './rfqStore';
export * from './quoteStore';
export * from './productionJobStore';
export * from './proofStore';
export * from './dispatchStore';
export * from './billingStore';
export * from './communicationStore';
export * from './companyProfileStore';

import { resetRfqStore } from './rfqStore';
import { resetQuoteStore } from './quoteStore';
import { resetProductionJobStore } from './productionJobStore';
import { resetProofStore } from './proofStore';
import { resetDispatchStore } from './dispatchStore';
import { resetBillingStore } from './billingStore';
import { resetCommunicationStore } from './communicationStore';
import { resetCompanyProfileStore } from './companyProfileStore';

export function resetAllPublisherStores(): void {
  resetRfqStore();
  resetQuoteStore();
  resetProductionJobStore();
  resetProofStore();
  resetDispatchStore();
  resetBillingStore();
  resetCommunicationStore();
  resetCompanyProfileStore();
}
