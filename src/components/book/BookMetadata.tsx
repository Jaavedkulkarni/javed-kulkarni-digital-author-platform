import { BOOK_FORMAT_LABELS, type BookFormat } from './bookTypes';

export interface BookMetadataFields {
  title?: string;
  author?: string;
  language?: string;
  category?: string;
  format?: BookFormat;
  publicationDate?: string;
}

interface BookMetadataProps extends BookMetadataFields {
  loading?: boolean;
  empty?: boolean;
  compact?: boolean;
  className?: string;
}

const PLACEHOLDER = '—';

function MetadataRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt>{label}</dt>
      <dd className="text-right text-navy-800 dark:text-gray-300">{value || PLACEHOLDER}</dd>
    </div>
  );
}

export function BookMetadata({
  title,
  author,
  language,
  category,
  format,
  publicationDate,
  loading = false,
  empty = false,
  compact = false,
  className = '',
}: BookMetadataProps) {
  if (loading) {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-navy-700" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-navy-700" />
        <div className="mt-2 space-y-1.5">
          {Array.from({ length: compact ? 2 : 4 }).map((_, i) => (
            <div key={i} className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-navy-700" />
          ))}
        </div>
      </div>
    );
  }

  const displayTitle = empty ? 'Title unavailable' : title || 'Title unavailable';
  const displayAuthor = empty ? 'Author unavailable' : author || 'Author unavailable';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className="line-clamp-2 text-base font-semibold text-navy-900 dark:text-white">{displayTitle}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{displayAuthor}</p>

      <dl className={`space-y-1 text-xs text-gray-500 dark:text-gray-400 ${compact ? 'mt-0' : 'mt-1'}`}>
        <MetadataRow label="Language" value={empty ? undefined : language} />
        <MetadataRow label="Category" value={empty ? undefined : category} />
        {!compact ? (
          <>
            <MetadataRow
              label="Format"
              value={empty || !format ? undefined : BOOK_FORMAT_LABELS[format]}
            />
            <MetadataRow label="Publication Date" value={empty ? undefined : publicationDate} />
          </>
        ) : null}
      </dl>
    </div>
  );
}

export default BookMetadata;
