import type { KeyboardEvent, MouseEvent } from 'react';
import { memo } from 'react';
import { BookCover, BookMetadata } from '../book';
import { DashboardCard } from '../dashboard/DashboardCard';
import type { ReadingCardItem } from './readingTypes';
import { ReadingProgressBar } from './shared/ReadingProgressBar';
import { ReadingStatusBadge } from './shared/ReadingStatusBadge';
import { ReadingTimeline } from './shared/ReadingTimeline';
import { ReadingTimeChip } from './shared/ReadingTimeChip';
import { ReadingPrimaryButton, ReadingSecondaryButton } from './readingUi';

interface ReadingCardProps {
  item: ReadingCardItem;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const PLACEHOLDER = '—';

const CARD_SELECTED =
  'border-brand ring-2 ring-brand/30 dark:border-gold-500/40 dark:ring-gold-500/20';

function stopInteraction(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

export const ReadingCard = memo(function ReadingCard({
  item,
  compact = false,
  selected = false,
  onSelect,
}: ReadingCardProps) {
  const title = item.title ?? PLACEHOLDER;
  const isSelectable = Boolean(onSelect);

  const handleSelect = () => {
    if (isSelectable) onSelect?.();
  };

  const handleSelectKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const layoutClass = compact
    ? 'flex flex-col gap-3 sm:flex-row sm:items-start'
    : 'flex h-full flex-col';

  const coverClass = compact ? 'sm:w-32 sm:shrink-0' : 'mb-2';

  return (
    <DashboardCard
      title={title}
      ariaLabel={`Reading progress: ${title}`}
      className={`h-full transition-all duration-200 ${selected ? CARD_SELECTED : ''}`}
      footer={
        <div
          className="flex flex-col gap-2 sm:flex-row sm:items-start"
          onClick={stopInteraction}
          onKeyDown={stopInteraction}
          onMouseDown={stopInteraction}
        >
          <ReadingPrimaryButton>Continue Reading</ReadingPrimaryButton>
          <ReadingSecondaryButton>View Details</ReadingSecondaryButton>
        </div>
      }
    >
      <div
        role="button"
        tabIndex={isSelectable ? 0 : -1}
        aria-selected={selected}
        aria-label={`Select ${title}`}
        onClick={handleSelect}
        onKeyDown={handleSelectKeyDown}
        className="cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
      >
        <article data-variant="reading" className={layoutClass}>
          <div className={coverClass}>
            <BookCover
              src={item.coverUrl}
              alt={item.coverAlt ?? `${title} cover`}
              size="md"
              empty={!item.coverUrl}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <BookMetadata
              title={item.title}
              author={item.author}
              language={item.language}
              category={item.category}
              format={item.format}
              compact
            />

            <ReadingProgressBar
              value={item.progressPercent ?? 0}
              currentPage={item.currentPage}
              totalPages={item.totalPages}
            />

            <div className="flex flex-wrap items-center gap-2">
              <ReadingTimeChip label="Time Spent" value={item.timeSpent} />
              <ReadingTimeChip label="Est. Remaining" value={item.estimatedTimeRemaining} />
            </div>

            <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] sm:text-xs">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Last Read</dt>
                <dd className="text-navy-900 dark:text-white">{item.lastRead ?? PLACEHOLDER}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Progress</dt>
                <dd className="tabular-nums text-navy-900 dark:text-white">
                  {item.progressPercent !== undefined ? `${item.progressPercent}%` : PLACEHOLDER}
                </dd>
              </div>
            </dl>

            <div aria-label="Reading status">
              <ReadingStatusBadge status={item.readingStatus ?? 'not-started'} />
            </div>

            <ReadingTimeline
              startedReading={item.startedReading}
              lastOpened={item.lastOpened}
              currentProgress={item.currentProgressLabel}
              completedDate={item.completedDate}
              compact
            />
          </div>
        </article>
      </div>
    </DashboardCard>
  );
});

export default ReadingCard;
