import { FILTER_INLINE_LABEL_CLASS, FILTER_INLINE_SELECT_CLASS } from '../shared/constants';

interface ReadingFiltersProps {
  open?: boolean;
}

export function ReadingFilters({ open = false }: ReadingFiltersProps) {
  return (
    <div
      id="reading-filters-panel"
      role="region"
      aria-label="Reading filters"
      hidden={!open}
      className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-navy-700 dark:bg-navy-900/40"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="reading-filter-status" className={FILTER_INLINE_LABEL_CLASS}>Status</label>
          <select id="reading-filter-status" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <div>
          <label htmlFor="reading-filter-language" className={FILTER_INLINE_LABEL_CLASS}>Language</label>
          <select id="reading-filter-language" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All Languages</option>
            <option value="marathi">Marathi</option>
            <option value="english">English</option>
          </select>
        </div>
        <div>
          <label htmlFor="reading-filter-category" className={FILTER_INLINE_LABEL_CLASS}>Category</label>
          <select id="reading-filter-category" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All Categories</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="poetry">Poetry</option>
          </select>
        </div>
        <div>
          <label htmlFor="reading-filter-progress" className={FILTER_INLINE_LABEL_CLASS}>Progress</label>
          <select id="reading-filter-progress" disabled aria-disabled="true" defaultValue="all" className={FILTER_INLINE_SELECT_CLASS}>
            <option value="all">All Progress</option>
            <option value="0-25">0–25%</option>
            <option value="25-75">25–75%</option>
            <option value="75-100">75–100%</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ReadingFilters;
