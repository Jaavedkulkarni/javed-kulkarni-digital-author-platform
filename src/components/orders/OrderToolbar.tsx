import { Filter, LayoutGrid, List, Search } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Placed' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'amount-high', label: 'Amount: High to Low' },
  { value: 'amount-low', label: 'Amount: Low to High' },
  { value: 'status', label: 'Order Status' },
] as const;

export function OrderToolbar() {
  return (
    <section
      aria-label="Orders toolbar"
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:p-5"
    >
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
            placeholder="Search orders..."
            disabled
            aria-disabled="true"
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            disabled
            aria-label="Filter orders"
            aria-disabled="true"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-navy-700 dark:text-gray-400"
          >
            <Filter className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Filter</span>
          </button>

          <div className="min-w-[10rem] flex-1 sm:flex-none">
            <label htmlFor="orders-sort" className="sr-only">
              Sort orders
            </label>
            <select
              id="orders-sort"
              disabled
              aria-disabled="true"
              defaultValue="recent"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-400"
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
              disabled
              aria-label="Grid view"
              aria-pressed="true"
              aria-disabled="true"
              className="inline-flex h-full items-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-white opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed"
            >
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              disabled
              aria-label="List view"
              aria-pressed="false"
              aria-disabled="true"
              className="inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-400"
            >
              <List className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderToolbar;
