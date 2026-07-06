import type { ReaderLocation } from './common';

export interface ReaderNote {
  id: string;
  userId: string;
  bookId: string;
  title: string | null;
  content: string;
  isPinned: boolean;
  location: ReaderLocation;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  userId: string;
  bookId: string;
  title?: string | null;
  content: string;
  isPinned?: boolean;
  location: ReaderLocation;
}

export interface UpdateNoteInput {
  id: string;
  title?: string | null;
  content?: string;
  isPinned?: boolean;
}
