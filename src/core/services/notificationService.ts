import type { Notification, TablesInsert } from '../../types/database';
import type { NotificationRepository } from '../../lib/repositories/notificationRepository';
import { getGlobalErrorHandler } from './globalErrorHandler';
import { CORE_LOG_SCOPES } from '../constants/app.constants';

export interface CreateNotificationInput {
  userId: string;
  title: string;
  body: string;
  category?: TablesInsert<'notifications'>['category'];
  channel?: TablesInsert<'notifications'>['channel'];
  actionUrl?: string | null;
  metadata?: TablesInsert<'notifications'>['metadata'];
}

export interface NotificationService {
  findByUser(userId: string): Promise<Notification[]>;
  findUnreadByUser(userId: string): Promise<Notification[]>;
  create(input: CreateNotificationInput): Promise<Notification>;
  markRead(id: string): Promise<Notification>;
}

export function createNotificationService(
  repository: NotificationRepository
): NotificationService {
  return {
    async findByUser(userId) {
      try {
        return await repository.findByUser(userId);
      } catch (error) {
        const handled = getGlobalErrorHandler().handle(error, {
          scope: CORE_LOG_SCOPES.container,
          operation: 'notifications.findByUser',
        });
        throw new Error(handled.message);
      }
    },

    async findUnreadByUser(userId) {
      try {
        return await repository.findUnreadByUser(userId);
      } catch (error) {
        const handled = getGlobalErrorHandler().handle(error, {
          scope: CORE_LOG_SCOPES.container,
          operation: 'notifications.findUnreadByUser',
        });
        throw new Error(handled.message);
      }
    },

    async create(input) {
      try {
        return await repository.createNotification({
          user_id: input.userId,
          title: input.title,
          body: input.body,
          category: input.category ?? 'system',
          channel: input.channel ?? 'in_app',
          action_url: input.actionUrl ?? null,
          metadata: input.metadata ?? {},
          is_read: false,
          is_archived: false,
        });
      } catch (error) {
        const handled = getGlobalErrorHandler().handle(error, {
          scope: CORE_LOG_SCOPES.container,
          operation: 'notifications.create',
        });
        throw new Error(handled.message);
      }
    },

    async markRead(id) {
      try {
        return await repository.updateNotification(id, { is_read: true });
      } catch (error) {
        const handled = getGlobalErrorHandler().handle(error, {
          scope: CORE_LOG_SCOPES.container,
          operation: 'notifications.markRead',
        });
        throw new Error(handled.message);
      }
    },
  };
}
