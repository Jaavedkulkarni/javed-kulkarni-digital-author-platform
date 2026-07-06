import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { loadBookCatalog } from '../infrastructure/bookCatalog';
import { mapDownloadToCardItem } from '../mappers/download.mapper';
import type { DownloadCardItem } from '../../components/downloads/downloadTypes';

export async function fetchDownloads(userId: string): Promise<DownloadCardItem[]> {
  const { readerRepositories } = getReaderDataAccess();
  const rows = await withRetry(
    async () => readerRepositories.downloads.findByUser(userId),
    { scope: 'reader.downloads.fetch' }
  );
  const catalog = await loadBookCatalog(rows.map((row) => row.book_id));
  return rows.map((row) => mapDownloadToCardItem(row, catalog));
}
