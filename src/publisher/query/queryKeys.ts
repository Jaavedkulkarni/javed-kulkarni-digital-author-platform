export const publisherQueryKeys = {
  all: ['publisher'] as const,
  context: (profileId: string) => [...publisherQueryKeys.all, 'context', profileId] as const,
  dashboard: (publisherId: string) => [...publisherQueryKeys.all, 'dashboard', publisherId] as const,
  rfqs: (publisherId: string) => [...publisherQueryKeys.all, 'rfqs', publisherId] as const,
  rfq: (publisherId: string, rfqId: string) =>
    [...publisherQueryKeys.all, 'rfq', publisherId, rfqId] as const,
  quotes: (publisherId: string, status?: string) =>
    [...publisherQueryKeys.all, 'quotes', publisherId, status ?? 'all'] as const,
  quote: (publisherId: string, quoteId: string) =>
    [...publisherQueryKeys.all, 'quote', publisherId, quoteId] as const,
  production: (publisherId: string, status?: string) =>
    [...publisherQueryKeys.all, 'production', publisherId, status ?? 'all'] as const,
  job: (publisherId: string, jobId: string) =>
    [...publisherQueryKeys.all, 'job', publisherId, jobId] as const,
  proofs: (publisherId: string) => [...publisherQueryKeys.all, 'proofs', publisherId] as const,
  proof: (publisherId: string, jobId: string) =>
    [...publisherQueryKeys.all, 'proof', publisherId, jobId] as const,
  dispatch: (publisherId: string) => [...publisherQueryKeys.all, 'dispatch', publisherId] as const,
  billing: (publisherId: string) => [...publisherQueryKeys.all, 'billing', publisherId] as const,
  payments: (publisherId: string) => [...publisherQueryKeys.all, 'payments', publisherId] as const,
  communication: (publisherId: string, jobId?: string) =>
    [...publisherQueryKeys.all, 'communication', publisherId, jobId ?? 'all'] as const,
  company: (publisherId: string) => [...publisherQueryKeys.all, 'company', publisherId] as const,
  performance: (publisherId: string) =>
    [...publisherQueryKeys.all, 'performance', publisherId] as const,
};
