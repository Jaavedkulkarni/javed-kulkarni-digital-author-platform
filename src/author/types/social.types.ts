export interface AuthorFollower {
  id: string;
  authorId: string;
  followerName: string;
  followerEmail: string | null;
  followedAt: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  authorId: string;
  reviewerName: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface BookComment {
  id: string;
  bookId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
