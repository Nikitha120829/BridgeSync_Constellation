import { useAuth } from '../AuthContext.jsx';
import { ActivityList, ErrorPanel, formatDate, LoadingPanel, StatusBadge, SummaryCard } from '../components/DashboardComponents.jsx';
import { useDashboard } from './useDashboard.js';

function currency(value, code) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: code ?? 'USD', maximumFractionDigits: 0 }).format(value ?? 0);
}

function InventoryTable({ records }) {
  if (!records.length) return <div className="empty-state">No inventory records have been seeded for this workspace.</div>;
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Product</th><th>On hand</th><th>Reserved</th><th>Available</th><th>Unit price</th><th>Last updated</th></tr></thead>
        <tbody>{records.map((record) => (
          <tr key={record.id}>
            <td className="cell-strong">{record.product}<small>{record.sku}</small></td>
            <td>{new Intl.NumberFormat().format(record.onHand)}</td>
            <td>{new Intl.NumberFormat().format(record.reserved)}</td>
            <td className="cell-strong">{new Intl.NumberFormat().format(record.available)}</td>
            <td>{currency(record.unitPrice, record.currency)}</td>
            <td>{formatDate(record.updatedAt)}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function IncomingOrdersTable({ orders }) {
  if (!orders.length) return <div className="empty-state">No incoming purchase orders have been seeded.</div>;
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Order</th><th>Buyer</th><th>Product</th><th>Quantity</th><th>Required by</th><th>Status</th></tr></thead>
        <tbody>{orders.map((order) => (
          <tr key={order.id}>
            <td className="cell-strong">{order.orderNumber}</td>
            <td>{order.buyer}</td>
            <td>{order.product}<small>{order.sku}</small></td>
            <td>{new Intl.NumberFormat().format(order.quantity)}</td>
            <td>{formatDate(order.requiredBy)}</td>
            <td><StatusBadge status={order.status} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export default function SupplierDashboard() {
  const { user } = useAuth();
  const { dashboard, loading, error, reload } = useDashboard('/api/dashboard/supplier');

  if (loading) return <LoadingPanel label="Loading Nova Components dashboard" />;
  if (error) return <ErrorPanel message={error} onRetry={reload} />;
  if (!dashboard) return <ErrorPanel message="Dashboard data is unavailable." onRetry={reload} />;

  const metrics = dashboard.metrics;
  const canReviewApprovals = user.permissions.includes('supplier:approvals:read');

  return (
    <div className="dashboard-page supplier-dashboard">
      <div className="page-heading">
        <div>
          <div className="page-eyebrow">NOVA COMPONENTS · SUPPLIER WORKSPACE</div>
          <h1>Welcome, {dashboard.user.displayName.split(' ')[0]}</h1>
          <p>Inventory position, incoming buyer orders, and supplier actions.</p>
        </div>
        <div className="heading-actions"><span className="role-chip supplier-role">Supplier · {dashboard.user.role.replace('supplier_', '').replaceAll('_', ' ')}</span></div>
      </div>

      <section className="summary-grid supplier-summary" aria-label="Supplier summary">
        <SummaryCard label="Active products" value={metrics.totalProducts} detail="Supplier product records" icon="▦" restricted={metrics.totalProducts == null} />
        <SummaryCard label="Available inventory" value={metrics.totalAvailableInventory} detail="On-hand less reserved" icon="◉" restricted={metrics.totalAvailableInventory == null} />
        <SummaryCard label="Incoming orders" value={metrics.incomingOrders} detail="Orders linked to Nova Components" icon="▤" />
        <SummaryCard label="Pending supply requests" value={metrics.pendingSupplierResponses} detail="Incoming orders awaiting response" icon="◷" />
        <SummaryCard label="Pending supplier approvals" value={metrics.pendingSupplierApprovals} detail="Read-only approval status" icon="✓" restricted={metrics.pendingSupplierApprovals == null} />
      </section>

      <section className="content-card inventory-card">
        <div className="section-heading"><div><h2>Inventory summary</h2><p>Quantities are retrieved from Nova Components inventory records.</p></div><span className="section-count">{dashboard.inventory.length} products</span></div>
        <InventoryTable records={dashboard.inventory} />
        <div className="inventory-note"><span>i</span> Available quantity is calculated as on-hand minus reserved. Inventory editing is scheduled for Part 2.</div>
      </section>

      <div className="dashboard-columns supplier-columns">
        <section className="content-card incoming-card">
          <div className="section-heading"><div><h2>Incoming purchase orders</h2><p>Latest buyer orders associated with Nova Components.</p></div><span className="section-count">{dashboard.incomingOrders.length} recent</span></div>
          <IncomingOrdersTable orders={dashboard.incomingOrders} />
        </section>
        <section className="content-card activity-card">
          <div className="section-heading"><div><h2>Recent inventory and account activity</h2><p>Company-scoped activity history.</p></div><span className="section-icon">◷</span></div>
          <ActivityList items={dashboard.recentActivity} />
        </section>
      </div>
      {!canReviewApprovals && <p className="permission-note">Approval counts are hidden because your role does not include supplier approval access.</p>}
      <footer className="dashboard-footer">Synthetic demonstration data · No live partner systems are connected</footer>
    </div>
  );
}
