import type { Tables } from '../../types/database';
import type { DownloadCardItem, DownloadStatus } from '../../components/downloads/downloadTypes';
import type { BookCatalogContext } from '../infrastructure/bookCatalog';
import {
  formatDateLabel,
  mapDigitalFormatToBookFormat,
  resolveBookAuthor,
  resolveBookCategory,
  resolveBookCover,
  resolveBookTitle,
} from './format';

function mapDownloadStatus(status: Tables<'downloads'>['status']): DownloadStatus {
  if (status === 'completed' || status === 'ready') return 'downloaded';
  if (status === 'expired') return 'expired';
  if (status === 'queued' || status === 'downloading') return 'pending';
  return 'pending';
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function mapDownloadToCardItem(
  download: Tables<'downloads'>,
  catalog: BookCatalogContext
): DownloadCardItem {
  const book = catalog.books.get(download.book_id);

  return {
    id: download.id,
    title: resolveBookTitle(book),
    author: resolveBookAuthor(book),
    coverUrl: resolveBookCover(book),
    coverAlt: resolveBookTitle(book),
    language: book?.primary_language ?? book?.language ?? undefined,
    category: resolveBookCategory(book, catalog.categories),
    format: mapDigitalFormatToBookFormat(download.format),
    downloadedOn: formatDateLabel(download.completed_at ?? download.created_at),
    lastOpened: formatDateLabel(download.last_downloaded_at) || undefined,
    downloadSize: formatFileSize(download.file_size_bytes),
    downloadStatus: mapDownloadStatus(download.status),
    offlineAvailable: download.status === 'completed' || download.status === 'ready',
    deviceCount: download.device_id ? '1 device' : '—',
  };
}
