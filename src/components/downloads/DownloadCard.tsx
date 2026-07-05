import { BookCover, BookMetadata } from '../book';
import { DashboardCard } from '../dashboard/DashboardCard';
import type { DownloadCardItem } from './downloadTypes';
import {
  DOWNLOAD_STATUS_LABELS,
  DOWNLOAD_STATUS_STYLES,
  OFFLINE_BADGE_STYLE,
} from './downloadTypes';
import { DownloadPrimaryButton, DownloadSecondaryButton, DownloadStatusBadge } from './downloadUi';

interface DownloadCardProps {
  item?: DownloadCardItem;
  compact?: boolean;
}

const PLACEHOLDER = '—';

export function DownloadCard({ item, compact = false }: DownloadCardProps) {
  const title = item?.title ?? PLACEHOLDER;

  const layoutClass = compact
    ? 'flex flex-col gap-3 sm:flex-row sm:items-start'
    : 'flex h-full flex-col';

  const coverClass = compact ? 'sm:w-36 sm:shrink-0' : 'mb-3';

  return (
    <DashboardCard
      title={title}
      ariaLabel={`Downloaded book: ${title}`}
      className="h-full"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row">
          <DownloadPrimaryButton>Open Book</DownloadPrimaryButton>
          <DownloadSecondaryButton>Manage Download</DownloadSecondaryButton>
        </div>
      }
    >
      <article data-variant="download" className={layoutClass}>
        <div className={coverClass}>
          <BookCover
            src={item?.coverUrl}
            alt={item?.coverAlt ?? `${title} cover`}
            size={compact ? 'md' : 'lg'}
            empty={!item?.coverUrl}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <BookMetadata
            title={item?.title}
            author={item?.author}
            language={item?.language}
            category={item?.category}
            format={item?.format}
            compact
          />

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Downloaded</dt>
              <dd className="text-navy-900 dark:text-white">{item?.downloadedDate ?? PLACEHOLDER}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">File Size</dt>
              <dd className="tabular-nums text-navy-900 dark:text-white">{item?.fileSize ?? PLACEHOLDER}</dd>
            </div>
          </dl>

          <div className="flex min-h-7 flex-wrap items-center gap-1.5" aria-label="Download status badges">
            {item?.downloadStatus ? (
              <DownloadStatusBadge
                label={DOWNLOAD_STATUS_LABELS[item.downloadStatus]}
                styleClass={DOWNLOAD_STATUS_STYLES[item.downloadStatus]}
              />
            ) : (
              <DownloadStatusBadge
                label="Download Status"
                styleClass="border-gray-200 bg-gray-100 text-gray-500 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400"
              />
            )}
            {item?.offlineAvailable ? (
              <DownloadStatusBadge label="Offline" styleClass={OFFLINE_BADGE_STYLE} />
            ) : null}
          </div>
        </div>
      </article>
    </DashboardCard>
  );
}

export default DownloadCard;
