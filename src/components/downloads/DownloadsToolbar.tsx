import { PageToolbar } from '../shared/toolbar/PageToolbar';
import { SearchInput } from '../shared/search/SearchInput';
import { SortDropdown } from '../shared/sort/SortDropdown';
import { GridListToggle } from '../shared/toggle/GridListToggle';
import { FilterButton } from '../shared/filters/FilterButton';
import { DOWNLOAD_SORT_OPTIONS } from './downloadTypes';
import { DownloadFilters } from './DownloadFilters';

export function DownloadsToolbar() {
  return (
    <PageToolbar
      ariaLabel="Downloads toolbar"
      footer={<DownloadFilters open={false} />}
    >
      <SearchInput
        id="downloads-search"
        label="Search downloads"
        placeholder="Search downloads..."
        disabled
      />

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <FilterButton
          ariaLabel="Filter downloads"
          disabled
          ariaControls="download-filters-panel"
        />
        <SortDropdown
          id="downloads-sort"
          label="Sort downloads"
          options={DOWNLOAD_SORT_OPTIONS}
          defaultValue="newest"
          disabled
        />
        <GridListToggle disabled />
      </div>
    </PageToolbar>
  );
}

export default DownloadsToolbar;
