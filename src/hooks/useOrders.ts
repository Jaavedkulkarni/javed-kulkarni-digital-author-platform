import { useCallback, useMemo, useState } from 'react';
import { MOCK_ORDERS } from '../data/mockOrders';
import {
  calculateOrderStats,
  DEFAULT_ORDER_FILTERS,
  getOrderFilterOptions,
  hasActiveOrderFilters,
  processOrders,
  type OrderFilters,
  type OrderSortKey,
  type OrderViewMode,
} from '../lib/orderBookLogic';

export function useOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_ORDER_FILTERS);
  const [sortKey, setSortKey] = useState<OrderSortKey>('newest');
  const [viewMode, setViewMode] = useState<OrderViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);

  const datasetEmpty = MOCK_ORDERS.length === 0;

  const filterOptions = useMemo(() => getOrderFilterOptions(MOCK_ORDERS), []);

  const orders = useMemo(
    () => processOrders(MOCK_ORDERS, searchQuery, filters, sortKey),
    [searchQuery, filters, sortKey]
  );

  const stats = useMemo(() => calculateOrderStats(MOCK_ORDERS), []);

  const filtersActive = useMemo(
    () => hasActiveOrderFilters(filters, searchQuery),
    [filters, searchQuery]
  );

  const updateFilter = useCallback(<K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ORDER_FILTERS);
  }, []);

  const selectOrder = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  const openDetails = useCallback((orderId: string) => {
    setDetailsOrderId(orderId);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsOrderId(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    filterOptions,
    sortKey,
    setSortKey,
    viewMode,
    setViewMode,
    filterOpen,
    setFilterOpen,
    orders,
    stats,
    datasetEmpty,
    filtersActive,
    selectedOrderId,
    selectOrder,
    clearSelection,
    detailsOrderId,
    openDetails,
    closeDetails,
  };
}

export default useOrders;
