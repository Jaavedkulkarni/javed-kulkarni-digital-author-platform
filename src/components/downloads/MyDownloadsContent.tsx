import { DownloadsPageHeader } from './DownloadsPageHeader';
import { DownloadsToolbar } from './DownloadsToolbar';
import { DownloadsStatistics } from './DownloadsStatistics';
import { DownloadsGrid } from './DownloadsGrid';

export function MyDownloadsContent() {
  const downloads: never[] = [];

  return (
    <div className="space-y-5 sm:space-y-6">
      <DownloadsPageHeader />
      <DownloadsToolbar />
      <DownloadsStatistics />
      <DownloadsGrid items={downloads} />
    </div>
  );
}

export default MyDownloadsContent;
