export interface BookReviewItem {
  id: string;
  bookTitle: string;
  authorName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  scheduledPublish: string | null;
}

export interface BlogReviewItem {
  id: string;
  title: string;
  authorName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
}

export interface CopyrightReport {
  id: string;
  contentTitle: string;
  reporter: string;
  status: 'open' | 'reviewing' | 'resolved';
  createdAt: string;
}

export interface FeaturedBookRequest {
  id: string;
  bookTitle: string;
  authorName: string;
  status: 'pending' | 'featured' | 'rejected';
}
