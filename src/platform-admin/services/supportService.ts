import {
  getTickets,
  getTicketNotes,
  assignTicket,
  updateTicketStatus,
  addTicketNote,
  setTicketPriority,
} from '../stores/supportStore';
import type { TicketStatus, TaskPriority } from '../types/common';
import type { PlatformAdminOperationResult } from '../types/common';

export class SupportService {
  getTickets(category?: 'reader' | 'author' | 'publisher') { return getTickets(category); }
  getNotes(ticketId: string) { return getTicketNotes(ticketId); }

  assignTicket(id: string, assignee: string): PlatformAdminOperationResult {
    const t = assignTicket(id, assignee);
    return t ? { success: true, data: t } : { success: false, errors: ['Ticket not found.'] };
  }

  updateStatus(id: string, status: TicketStatus): PlatformAdminOperationResult {
    const t = updateTicketStatus(id, status);
    return t ? { success: true, data: t } : { success: false, errors: ['Invalid status transition.'] };
  }

  addNote(ticketId: string, content: string, isInternal: boolean, author: string) {
    return addTicketNote(ticketId, content, isInternal, author);
  }

  setPriority(id: string, priority: TaskPriority): PlatformAdminOperationResult {
    const t = setTicketPriority(id, priority);
    return t ? { success: true, data: t } : { success: false, errors: ['Ticket not found.'] };
  }
}

export function createSupportService(): SupportService {
  return new SupportService();
}
