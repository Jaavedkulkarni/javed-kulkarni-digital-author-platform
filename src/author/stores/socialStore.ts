import type { AuthorFollower, BookReview } from '../types/social.types';

const followers = new Map<string, AuthorFollower[]>();
const reviews = new Map<string, BookReview[]>();

export function getFollowers(authorId: string): AuthorFollower[] {
  return followers.get(authorId) ?? [];
}

export function addFollower(follower: AuthorFollower): void {
  const list = followers.get(follower.authorId) ?? [];
  followers.set(follower.authorId, [...list, follower]);
}

export function getReviews(authorId: string): BookReview[] {
  return reviews.get(authorId) ?? [];
}

export function getBookReviews(bookId: string): BookReview[] {
  return [...reviews.values()].flat().filter((r) => r.bookId === bookId);
}

export function addReview(review: BookReview): void {
  const list = reviews.get(review.authorId) ?? [];
  reviews.set(review.authorId, [...list, review]);
}

export function seedSocialData(authorId: string): void {
  if (getFollowers(authorId).length > 0) return;
  addFollower({
    id: `fol_${Date.now()}`,
    authorId,
    followerName: 'Priya Sharma',
    followerEmail: 'priya@example.com',
    followedAt: new Date().toISOString(),
  });
  addReview({
    id: `rev_${Date.now()}`,
    authorId,
    bookId: 'seed-book',
    reviewerName: 'Rahul Desai',
    rating: 5,
    title: 'Wonderful read',
    content: 'Engaging storytelling and rich characters.',
    createdAt: new Date().toISOString(),
  });
}

export function resetSocialStore(): void {
  followers.clear();
  reviews.clear();
}
