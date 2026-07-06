import type { AuthorNotificationRepository } from '../repositories/notificationRepository';
import type { Notification } from '../../types/database';

export class AuthorNotificationService {
  constructor(private readonly repo: AuthorNotificationRepository) {}

  async list(userId: string): Promise<Notification[]> {
    return this.repo.findByUser(userId);
  }

  async countUnread(userId: string): Promise<number> {
    return this.repo.countUnread(userId);
  }

  async markRead(id: string): Promise<Notification> {
    return this.repo.markRead(id);
  }
}

export function createAuthorNotificationService(
  repo: AuthorNotificationRepository
): AuthorNotificationService {
  return new AuthorNotificationService(repo);
}
