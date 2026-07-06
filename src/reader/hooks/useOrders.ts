import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  calculateOrderStats,
  DEFAULT_ORDER_FILTERS,
  getOrderFilterOptions,
  hasActiveOrderFilters,
  processOrders,
  type OrderFilters,
  type OrderSortKey,
  type OrderViewMode,
} from '../../lib/orderBookLogic';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchOrders } from '../services/orders.service';
import { syncMockOrders } from '../utils/mockSync';
import { EMPTY_ORDERS } from '../utils/queryDefaults';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useOrders() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_ORDER_FILTERS);
  const [sortKey, setSortKey] = useState<OrderSortKey>('newest');
  const [viewMode, setViewMode] = useState<OrderViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: readerQueryKeys.orders(userId ?? 'guest'),
    queryFn: () => fetchOrders(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  const sourceOrders = query.data ?? EMPTY_ORDERS;

  useEffect(() => {
    syncMockOrders(sourceOrders);
  }, [sourceOrders]);

  const datasetEmpty = !query.isLoading && sourceOrders.length === 0;

  const filterOptions = useMemo(() => getOrderFilterOptions(sourceOrders), [sourceOrders]);

  const orders = useMemo(
    () => processOrders(sourceOrders, searchQuery, filters, sortKey),
    [sourceOrders, searchQuery, filters, sortKey]
  );

  const stats = useMemo(() => calculateOrderStats(sourceOrders), [sourceOrders]);

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
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

export default useOrders;
