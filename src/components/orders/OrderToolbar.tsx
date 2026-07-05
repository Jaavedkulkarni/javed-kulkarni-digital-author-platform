import { useEffect, useRef, memo } from 'react';
import { Filter, LayoutGrid, List, Search, X } from 'lucide-react';
import type {
  OrderFilters,
  OrderPaymentStatusFilter,
  OrderSortKey,
  OrderStatusFilter,
  OrderTriFilter,
  OrderViewMode,
} from '../../lib/orderBookLogic';

const SORT_OPTIONS: { value: OrderSortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest-amount', label: 'Highest Amount' },
  { value: 'lowest-amount', label: 'Lowest Amount' },
  { value: 'recently-downloaded', label: 'Recently Downloaded' },
];

const CONTROL_CLASS =
  'inline-flex min-h-10 items-center rounded-lg border border-gray-200 text-sm font-medium text-navy-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:text-gray-200';

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

  const selectClass =
    'w-full min-h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-200';

  return (
    <section
      aria-label="Orders toolbar"
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-navy-700 dark:bg-navy-800 sm:p-5"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {resultCount} {resultCount === 1 ? 'order' : 'orders'} shown
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <label htmlFor="orders-search" className="sr-only">
            Search orders
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
          <input
            id="orders-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => onFilterOpenChange(!filterOpen)}
              aria-label={filtersActive ? 'Filter orders (filters active)' : 'Filter orders'}
              aria-expanded={filterOpen}
              aria-haspopup="dialog"
              className={`${CONTROL_CLASS} gap-2 px-3 hover:bg-gray-50 dark:hover:bg-navy-900/60 ${
                filtersActive ? 'border-brand/40 bg-brand/5 dark:border-brand/30 dark:bg-brand/10' : ''
              }`}
            >
              <Filter className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Filter</span>
              {filtersActive ? (
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-brand" />
              ) : null}
            </button>

            {filterOpen ? (
              <div
                role="dialog"
                aria-label="Order filters"
                className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-navy-700 dark:bg-navy-800 sm:w-80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-navy-900 dark:text-white">Filters</h3>
                  <button
                    type="button"
                    onClick={() => onFilterOpenChange(false)}
                    aria-label="Close filters"
                    className="inline-flex min-h-8 min-w-8 items-center justify-center rounded text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="order-filter-payment" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Payment Status
                    </label>
                    <select
                      id="order-filter-payment"
                      value={filters.paymentStatus}
                      onChange={(e) =>
                        onFilterChange('paymentStatus', e.target.value as OrderPaymentStatusFilter)
                      }
                      className={selectClass}
                    >
                      <option value="all">All Payment Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="order-filter-status" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Order Status
                    </label>
                    <select
                      id="order-filter-status"
                      value={filters.orderStatus}
                      onChange={(e) => onFilterChange('orderStatus', e.target.value as OrderStatusFilter)}
                      className={selectClass}
                    >
                      <option value="all">All Order Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="refunded">Refunded</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="order-filter-membership" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Membership Purchase
                    </label>
                    <select
                      id="order-filter-membership"
                      value={filters.membershipPurchase}
                      onChange={(e) =>
                        onFilterChange('membershipPurchase', e.target.value as OrderTriFilter)
                      }
                      className={selectClass}
                    >
                      <option value="all">All</option>
                      <option value="yes">Membership</option>
                      <option value="no">Non-Membership</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="order-filter-download" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Download Available
                    </label>
                    <select
                      id="order-filter-download"
                      value={filters.downloadAvailable}
                      onChange={(e) =>
                        onFilterChange('downloadAvailable', e.target.value as OrderTriFilter)
                      }
                      className={selectClass}
                    >
                      <option value="all">All</option>
                      <option value="yes">Available</option>
                      <option value="no">Not Available</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="order-filter-year" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Year
                    </label>
                    <select
                      id="order-filter-year"
                      value={filters.year}
                      onChange={(e) => onFilterChange('year', e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onResetFilters}
                  disabled={!filtersActive}
                  className="mt-4 flex min-h-10 w-full items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-900/60"
                >
                  Reset Filters
                </button>
              </div>
            ) : null}
          </div>

          <div className="min-w-[10rem] flex-1 sm:flex-none">
            <label htmlFor="orders-sort" className="sr-only">
              Sort orders
            </label>
            <select
              id="orders-sort"
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value as OrderSortKey)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-200"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            role="group"
            aria-label="View toggle"
            className="inline-flex h-10 items-center rounded-lg border border-gray-200 p-1 dark:border-navy-700"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
                viewMode === 'grid'
                  ? 'bg-brand text-white'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-900/60'
              }`}
            >
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
                viewMode === 'list'
                  ? 'bg-brand text-white'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-900/60'
              }`}
            >
              <List className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default OrderToolbar;
