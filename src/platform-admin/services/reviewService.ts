import type { BookService } from '../../cms/services/bookService';
import type { AuthorService } from '../../cms/services/authorService';
import type { NotificationRepository } from '../../lib/repositories/notificationRepository';
import { getBlogReviews, getCopyrightReports, getFeaturedRequests, reviewBlog } from '../stores/reviewStore';
import type { BookReviewItem } from '../types/review.types';
import type { ReviewDecision } from '../types/common';
import type { PlatformAdminOperationResult } from '../types/common';
import type { BookWorkflowAction } from '../../cms/types/workflow.types';
import { validateReviewDecision } from '../validators/reviewValidator';
import { canReviewItem } from '../workflow/workflows';

function mapDecisionToAction(decision: ReviewDecision): BookWorkflowAction {
  if (decision === 'approve') return 'approve';
  return 'reject';
}

export class ReviewService {
  constructor(
    private readonly cmsBooks: BookService,
    private readonly cmsAuthors: AuthorService,
    private readonly notifications: NotificationRepository
  ) {}

  async getBookQueue(): Promise<BookReviewItem[]> {
    const books = await this.cmsBooks.list({ workflowStatus: 'review' });
    const items = await Promise.all(
      books.map(async (book) => {
        const author = book.author_id ? await this.cmsAuthors.getById(book.author_id) : null;
        return {
          id: book.id,
          bookTitle: book.title,
          authorName: author?.display_name ?? 'Unknown Author',
          submittedAt: book.updated_at ?? book.created_at,
          status: 'pending' as const,
          scheduledPublish: book.publication_date,
        };
      })
    );
    return items;
  }

  getBlogQueue() {
    return getBlogReviews();
  }

  getCopyrightReports() {
    return getCopyrightReports();
  }

  getFeaturedRequests() {
    return getFeaturedRequests();
  }

  async getPendingBookCount(): Promise<number> {
    const queue = await this.getBookQueue();
    return queue.filter((b) => b.status === 'pending').length;
  }

  async reviewBook(id: string, decision: ReviewDecision, actorId: string): Promise<PlatformAdminOperationResult> {
    const validation = validateReviewDecision(decision);
    if (!validation.valid) return { success: false, errors: validation.errors };

    const book = await this.cmsBooks.getById(id);
    if (!book || book.workflow_status !== 'review') {
      return { success: false, errors: ['Item cannot be reviewed.'] };
    }
    if (!canReviewItem('pending', decision)) {
      return { success: false, errors: ['Invalid review decision.'] };
    }

    const result = await this.cmsBooks.transitionWorkflow({
      bookId: id,
      action: mapDecisionToAction(decision),
      actorId,
    });
    if (result.errors?.length) return { success: false, errors: result.errors };

    if (decision === 'approve' && result.book) {
      const author = result.book.author_id ? await this.cmsAuthors.getById(result.book.author_id) : null;
      if (author?.profile_id) {
        await this.notifications.createNotification({
          user_id: author.profile_id,
          category: 'reading',
          channel: 'in_app',
          title: 'Book published',
          body: `"${result.book.title}" is now live in the reader catalog.`,
          reference_type: 'book',
          reference_id: result.book.id,
          action_url: `/books/${result.book.slug}`,
          action_label: 'View book',
        });
      }
    }

    return { success: true, data: result.book };
  }

  reviewBlog(id: string, decision: ReviewDecision): PlatformAdminOperationResult {
    const validation = validateReviewDecision(decision);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const updated = reviewBlog(id, decision);
    return updated ? { success: true, data: updated } : { success: false, errors: ['Review failed.'] };
  }
}

export function createReviewService(
  cmsBooks: BookService,
  cmsAuthors: AuthorService,
  notifications: NotificationRepository
): ReviewService {
  return new ReviewService(cmsBooks, cmsAuthors, notifications);
}
