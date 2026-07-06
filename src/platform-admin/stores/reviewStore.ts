import type { BookReviewItem, BlogReviewItem, CopyrightReport, FeaturedBookRequest } from '../types/review.types';
import type { ReviewDecision } from '../types/common';
import { generateId } from '../utils/permissions';

const bookReviews: BookReviewItem[] = [
  { id: generateId('br'), bookTitle: 'Echoes of the Monsoon', authorName: 'Javed Kulkarni', submittedAt: new Date().toISOString(), status: 'pending', scheduledPublish: null },
  { id: generateId('br'), bookTitle: 'Digital Dharma', authorName: 'Priya Sharma', submittedAt: new Date().toISOString(), status: 'pending', scheduledPublish: null },
];
const blogReviews: BlogReviewItem[] = [
  { id: generateId('blr'), title: 'The Future of Indie Publishing', authorName: 'Arun Mehta', submittedAt: new Date().toISOString(), status: 'pending' },
];
const copyrightReports: CopyrightReport[] = [
  { id: generateId('cr'), contentTitle: 'Sample Book', reporter: 'Rights Holder', status: 'open', createdAt: new Date().toISOString() },
];
const featured: FeaturedBookRequest[] = [];

export function getBookReviews(): BookReviewItem[] {
  return bookReviews;
}

export function getBlogReviews(): BlogReviewItem[] {
  return blogReviews;
}

export function getCopyrightReports(): CopyrightReport[] {
  return copyrightReports;
}

export function getFeaturedRequests(): FeaturedBookRequest[] {
  return featured;
}

export function reviewBook(id: string, decision: ReviewDecision): BookReviewItem | null {
  const idx = bookReviews.findIndex((b) => b.id === id);
  if (idx < 0) return null;
  const status = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'changes_requested';
  bookReviews[idx] = { ...bookReviews[idx], status };
  return bookReviews[idx];
}

export function reviewBlog(id: string, decision: ReviewDecision): BlogReviewItem | null {
  const idx = blogReviews.findIndex((b) => b.id === id);
  if (idx < 0) return null;
  const status = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'changes_requested';
  blogReviews[idx] = { ...blogReviews[idx], status };
  return blogReviews[idx];
}
