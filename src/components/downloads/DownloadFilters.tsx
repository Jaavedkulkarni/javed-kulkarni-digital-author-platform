import { FILTER_INLINE_LABEL_CLASS, FILTER_INLINE_SELECT_CLASS } from '../shared/constants';

interface DownloadFiltersProps {
  open?: boolean;
}

export function DownloadFilters({ open = false }: DownloadFiltersProps) {
  return (
    <div
      id="download-filters-panel"
      role="region"
      aria-label="Download filters"
      hidden={!open}
      className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-navy-700 dark:bg-navy-900/40"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="download-filter-status" className={FILTER_INLINE_LABEL_CLASS}>Status</label>
          <select id="download-filter-status" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All Statuses</option>
            <option value="downloaded">Downloaded</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="membership">Membership</option>
          </select>
        </div>
        <div>
          <label htmlFor="download-filter-format" className={FILTER_INLINE_LABEL_CLASS}>Format</label>
          <select id="download-filter-format" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All Formats</option>
            <option value="ebook">eBook</option>
            <option value="audiobook">Audiobook</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div>
          <label htmlFor="download-filter-offline" className={FILTER_INLINE_LABEL_CLASS}>Offline</label>
          <select id="download-filter-offline" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All</option>
            <option value="available">Available Offline</option>
            <option value="unavailable">Not Available</option>
          </select>
        </div>
        <div>
          <label htmlFor="download-filter-language" className={FILTER_INLINE_LABEL_CLASS}>Language</label>
          <select id="download-filter-language" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All Languages</option>
            <option value="marathi">Marathi</option>
            <option value="english">English</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default DownloadFilters;
