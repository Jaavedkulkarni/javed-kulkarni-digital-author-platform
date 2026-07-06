import type { SupportTicket, TicketNote } from '../types/support.types';
import type { TicketStatus, TaskPriority } from '../types/common';
import { generateId } from '../utils/permissions';
import { canTransitionTicket } from '../workflow/workflows';

const tickets: SupportTicket[] = [
  { id: generateId('tk'), ticketNumber: 'TK-1001', subject: 'Cannot download purchased book', category: 'reader', priority: 'high', status: 'open', assignee: null, createdAt: new Date().toISOString() },
  { id: generateId('tk'), ticketNumber: 'TK-1002', subject: 'Royalty statement discrepancy', category: 'author', priority: 'normal', status: 'assigned', assignee: 'Support Agent', createdAt: new Date().toISOString() },
  { id: generateId('tk'), ticketNumber: 'TK-1003', subject: 'RFQ clarification needed', category: 'publisher', priority: 'normal', status: 'open', assignee: null, createdAt: new Date().toISOString() },
];
const notes: TicketNote[] = [];

export function getTickets(category?: SupportTicket['category']) {
  return category ? tickets.filter((t) => t.category === category) : tickets;
}

export function getTicketNotes(ticketId: string) {
  return notes.filter((n) => n.ticketId === ticketId);
}

export function assignTicket(id: string, assignee: string): SupportTicket | null {
  const t = tickets.find((x) => x.id === id);
  if (!t) return null;
  t.assignee = assignee;
  t.status = 'assigned';
  return t;
}

export function updateTicketStatus(id: string, status: TicketStatus): SupportTicket | null {
  const t = tickets.find((x) => x.id === id);
  if (!t || !canTransitionTicket(t.status, status)) return null;
  t.status = status;
  return t;
}

export function addTicketNote(ticketId: string, content: string, isInternal: boolean, author: string): TicketNote {
  const note: TicketNote = { id: generateId('tn'), ticketId, content, isInternal, author, createdAt: new Date().toISOString() };
  notes.push(note);
  return note;
}

export function setTicketPriority(id: string, priority: TaskPriority): SupportTicket | null {
  const t = tickets.find((x) => x.id === id);
  if (!t) return null;
  t.priority = priority;
  return t;
}
