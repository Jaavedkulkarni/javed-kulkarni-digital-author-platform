import type { ReaderLocation } from './common';

export interface ReaderBookmark {
  id: string;
  userId: string;
  bookId: string;
  label: string | null;
  note: string | null;
  color: string;
  isAuto: boolean;
  location: ReaderLocation;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkInput {
  userId: string;
  bookId: string;
  label?: string | null;
  note?: string | null;
  color?: string;
  isAuto?: boolean;
  location: ReaderLocation;
}

export interface UpdateBookmarkInput {
  id: string;
  label?: string | null;
  note?: string | null;
  color?: string;
}
