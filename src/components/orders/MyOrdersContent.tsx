/**
 * Orders UI Version 1.0.1 — Frozen
 * Sprint 04C + v1.0.1 final polish.
 */
import { useMemo } from 'react';
import { MOCK_ORDERS } from '../../data/mockOrders';
import { findMockOrder, toOrderDetailView } from '../../lib/orderBookLogic';
import { useOrders } from '../../hooks/useOrders';
import { OrderPageHeader } from './OrderPageHeader';
import { OrderToolbar } from './OrderToolbar';
import { OrderStatistics } from './OrderStatistics';
import { OrderGrid } from './OrderGrid';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';

export function MyOrdersContent() {
  const ordersState = useOrders();

  const detailsView = useMemo(() => {
    if (!ordersState.detailsOrderId) return null;
    const order = findMockOrder(MOCK_ORDERS, ordersState.detailsOrderId);
    return order ? toOrderDetailView(order) : null;
  }, [ordersState.detailsOrderId]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <OrderPageHeader />
      <OrderToolbar
        searchQuery={ordersState.searchQuery}
        onSearchChange={ordersState.setSearchQuery}
        sortKey={ordersState.sortKey}
        onSortChange={ordersState.setSortKey}
        viewMode={ordersState.viewMode}
        onViewModeChange={ordersState.setViewMode}
        filters={ordersState.filters}
        onFilterChange={ordersState.updateFilter}
        onResetFilters={ordersState.resetFilters}
        filterOpen={ordersState.filterOpen}
        onFilterOpenChange={ordersState.setFilterOpen}
        filtersActive={ordersState.filtersActive}
        resultCount={ordersState.orders.length}
        years={ordersState.filterOptions.years}
      />
      <OrderStatistics stats={ordersState.stats} />
      <OrderGrid
        orders={ordersState.orders}
        viewMode={ordersState.viewMode}
        datasetEmpty={ordersState.datasetEmpty}
        selectedOrderId={ordersState.selectedOrderId}
        onSelectOrder={ordersState.selectOrder}
        onClearSelection={ordersState.clearSelection}
        onViewDetails={ordersState.openDetails}
      />
      <OrderDetailsDrawer
        detail={detailsView}
        open={ordersState.detailsOrderId !== null}
        onClose={ordersState.closeDetails}
      />
    </div>
  );
}

export default MyOrdersContent;
