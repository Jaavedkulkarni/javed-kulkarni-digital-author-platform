import type { DigitalFormat } from '../../types/database';
import type { ReaderFormat } from './common';

export interface LoadedBookMetadata {
  bookId: string;
  title: string;
  authorName: string | null;
  coverUrl: string | null;
  format: ReaderFormat;
  totalPages: number | null;
  totalWords: number | null;
  language: string | null;
}

export interface BookAssetUrl {
  bookId: string;
  format: DigitalFormat;
  signedUrl: string;
  expiresIn: number;
  storagePath: string;
}

export interface BookLoadResult {
  metadata: LoadedBookMetadata;
  assetUrl: BookAssetUrl | null;
  fromCache: boolean;
}

export interface ChapterContent {
  chapterId: string;
  title: string;
  chapterNumber: number;
  content: string | null;
  wordCount: number | null;
  storagePath: string | null;
}
