export interface PublisherPerformanceMetrics {
  completedJobs: number;
  cancelledJobs: number;
  delayedJobs: number;
  averageProductionDays: number;
  averageQuoteAmount: number;
  winRatio: number;
  qualityRating: number;
  deliveryRating: number;
}

export interface PublisherDashboardOverview {
  todaysProductionJobs: number;
  pendingQuotations: number;
  submittedQuotations: number;
  wonQuotations: number;
  lostQuotations: number;
  productionQueue: number;
  readyForDispatch: number;
  dispatched: number;
  delivered: number;
  completedJobs: number;
  cancelledJobs: number;
  performance: PublisherPerformanceMetrics;
}
