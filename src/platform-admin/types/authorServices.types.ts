export interface AuthorServiceRequest {
  id: string;
  requestNumber: string;
  authorName: string;
  type: 'formatting' | 'cover_design' | 'editing' | 'translation' | 'publishing_assistance';
  status: 'queued' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: string;
  createdAt: string;
}
