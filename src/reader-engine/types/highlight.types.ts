import type { ReaderLocation } from './common';

export interface ReaderHighlight {
  id: string;
  userId: string;
  bookId: string;
  selectedText: string;
  note: string | null;
  color: string;
  location: ReaderLocation;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHighlightInput {
  userId: string;
  bookId: string;
  selectedText: string;
  note?: string | null;
  color?: string;
  location: ReaderLocation;
}

export interface UpdateHighlightInput {
  id: string;
  note?: string | null;
  color?: string;
}
