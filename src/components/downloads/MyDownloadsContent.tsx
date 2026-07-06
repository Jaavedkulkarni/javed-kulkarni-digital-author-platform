import { DownloadsPageHeader } from './DownloadsPageHeader';
import { DownloadsToolbar } from './DownloadsToolbar';
import { DownloadsStatistics } from './DownloadsStatistics';
import { DownloadGrid } from './DownloadGrid';

export function MyDownloadsContent() {
  const downloads: never[] = [];

  return (
    <div className="space-y-5 sm:space-y-6">
      <DownloadsPageHeader />
      <DownloadsToolbar />
      <DownloadsStatistics />
      <DownloadGrid items={downloads} />
    </div>
  );
}

export default MyDownloadsContent;
