export interface PaperbackRequest {
  id: string;
  requestNumber: string;
  bookTitle: string;
  authorName: string;
  quantity: number;
  status: 'pending' | 'rfq_sent' | 'quoted' | 'assigned' | 'in_production' | 'completed';
  createdAt: string;
}

export interface RfqRecord {
  id: string;
  rfqNumber: string;
  paperbackRequestId: string;
  bookTitle: string;
  publisherCount: number;
  status: 'open' | 'closed';
  dueDate: string;
}

export interface QuoteComparison {
  id: string;
  rfqId: string;
  publisherName: string;
  amount: number;
  leadTimeDays: number;
  selected: boolean;
}

export interface ProductionTracking {
  id: string;
  jobNumber: string;
  bookTitle: string;
  publisherName: string;
  status: string;
  proofStatus: string;
  dispatchStatus: string;
  deliveryStatus: string;
}
