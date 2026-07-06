import { useEffect, useRef, memo } from 'react';
import type {
  OrderFilters,
  OrderPaymentStatusFilter,
  OrderSortKey,
  OrderStatusFilter,
  OrderTriFilter,
  OrderViewMode,
} from '../../lib/orderBookLogic';
import { PageToolbar } from '../shared/toolbar/PageToolbar';
import { SearchInput } from '../shared/search/SearchInput';
import { SortDropdown } from '../shared/sort/SortDropdown';
import { GridListToggle } from '../shared/toggle/GridListToggle';
import { FilterButton } from '../shared/filters/FilterButton';
import { FilterField, FilterPopover } from '../shared/filters/FilterPanel';

const SORT_OPTIONS: { value: OrderSortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest-amount', label: 'Highest Amount' },
  { value: 'lowest-amount', label: 'Lowest Amount' },
  { value: 'recently-downloaded', label: 'Recently Downloaded' },
];

interface OrderToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortKey: OrderSortKey;
  onSortChange: (value: OrderSortKey) => void;
  viewMode: OrderViewMode;
  onViewModeChange: (mode: OrderViewMode) => void;
  filters: OrderFilters;
  onFilterChange: <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => void;
  onResetFilters: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  filtersActive: boolean;
  resultCount: number;
  years: string[];
}

export const OrderToolbar = memo(function OrderToolbar({
  searchQuery,
  onSearchChange,
  sortKey,
  onSortChange,
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  onResetFilters,
  filterOpen,
  onFilterOpenChange,
  filtersActive,
  resultCount,
  years,
}: OrderToolbarProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        onFilterOpenChange(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFilterOpenChange(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [filterOpen, onFilterOpenChange]);

  return (
    <PageToolbar
      ariaLabel="Orders toolbar"
      announcement={`${resultCount} ${resultCount === 1 ? 'order' : 'orders'} shown`}
    >
      <SearchInput
        id="orders-search"
        label="Search orders"
        placeholder="Search orders..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative" ref={filterRef}>
          <FilterButton
            ariaLabel={filtersActive ? 'Filter orders (filters active)' : 'Filter orders'}
            active={filtersActive}
            open={filterOpen}
            onClick={() => onFilterOpenChange(!filterOpen)}
          />
          <FilterPopover
            open={filterOpen}
            ariaLabel="Order filters"
            onClose={() => onFilterOpenChange(false)}
            onReset={onResetFilters}
            filtersActive={filtersActive}
          >
            <FilterField id="order-filter-payment" label="Payment Status" value={filters.paymentStatus} onChange={(value) => onFilterChange('paymentStatus', value as OrderPaymentStatusFilter)}>
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </FilterField>
            <FilterField id="order-filter-status" label="Order Status" value={filters.orderStatus} onChange={(value) => onFilterChange('orderStatus', value as OrderStatusFilter)}>
              <option value="all">All Order Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </FilterField>
            <FilterField id="order-filter-membership" label="Membership Purchase" value={filters.membershipPurchase} onChange={(value) => onFilterChange('membershipPurchase', value as OrderTriFilter)}>
              <option value="all">All</option>
              <option value="yes">Membership</option>
              <option value="no">Non-Membership</option>
            </FilterField>
            <FilterField id="order-filter-download" label="Download Available" value={filters.downloadAvailable} onChange={(value) => onFilterChange('downloadAvailable', value as OrderTriFilter)}>
              <option value="all">All</option>
              <option value="yes">Available</option>
              <option value="no">Not Available</option>
            </FilterField>
            <FilterField id="order-filter-year" label="Year" value={filters.year} onChange={(value) => onFilterChange('year', value)}>
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </FilterField>
          </FilterPopover>
        </div>

        <SortDropdown id="orders-sort" label="Sort orders" options={SORT_OPTIONS} value={sortKey} onChange={onSortChange} />
        <GridListToggle viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </PageToolbar>
  );
});

export default OrderToolbar;
