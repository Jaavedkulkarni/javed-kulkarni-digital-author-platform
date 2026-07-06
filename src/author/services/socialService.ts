import {
  getFollowers,
  addFollower,
  getReviews,
  getBookReviews,
  addReview,
  seedSocialData,
} from '../stores/socialStore';
import type { AuthorFollower, BookReview, ReviewSummary } from '../types/social.types';

export class AuthorSocialService {
  getFollowers(authorId: string): AuthorFollower[] {
    seedSocialData(authorId);
    return getFollowers(authorId);
  }

  getReviews(authorId: string): BookReview[] {
    seedSocialData(authorId);
    return getReviews(authorId);
  }

  getBookReviews(bookId: string): BookReview[] {
    return getBookReviews(bookId);
  }

  getReviewSummary(authorId: string): ReviewSummary {
    const reviews = this.getReviews(authorId);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ReviewSummary['distribution'];
    for (const r of reviews) {
      const key = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[key] += 1;
    }
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    return { averageRating: Math.round(average * 10) / 10, totalReviews: total, distribution };
  }

  addFollower(follower: Omit<AuthorFollower, 'id'>): AuthorFollower {
    const record: AuthorFollower = { ...follower, id: `fol_${Date.now()}` };
    addFollower(record);
    return record;
  }

  addReview(review: Omit<BookReview, 'id' | 'createdAt'>): BookReview {
    const record: BookReview = { ...review, id: `rev_${Date.now()}`, createdAt: new Date().toISOString() };
    addReview(record);
    return record;
  }
}

export function createAuthorSocialService(): AuthorSocialService {
  return new AuthorSocialService();
}
