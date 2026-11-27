import { useAuth } from '../AuthContext.jsx';
import { ActivityList, ErrorPanel, formatDate, LoadingPanel, StatusBadge, SummaryCard } from '../components/DashboardComponents.jsx';
import { useDashboard } from './useDashboard.js';


function OrdersTable({ orders }) {
  if (!orders.length) return <div className="empty-state">No purchase orders have been seeded for this workspace.</div>;
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Order</th><th>Supplier</th><th>Product</th><th>Quantity</th><th>Order date</th><th>Status</th></tr></thead>
        <tbody>{orders.map((order) => (
          <tr key={order.id}>
            <td className="cell-strong">{order.orderNumber}</td>
            <td>{order.supplier}</td>
            <td>{order.product}<small>{order.sku}</small></td>
            <td>{new Intl.NumberFormat().format(order.quantity)}</td>
            <td>{formatDate(order.orderDate)}</td>
            <td><StatusBadge status={order.status} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { dashboard, loading, error, reload } = useDashboard('/api/dashboard/buyer');

  if (loading) return <LoadingPanel label="Loading Apex Motors dashboard" />;
  if (error) return <ErrorPanel message={error} onRetry={reload} />;
  if (!dashboard) return <ErrorPanel message="Dashboard data is unavailable." onRetry={reload} />;

  const metrics = dashboard.metrics;
  const canReviewApprovals = user.permissions.includes('buyer:approvals:read');

  return (
    <div className="dashboard-page buyer-dashboard">
      <div className="page-heading">
        <div>
          <div className="page-eyebrow">APEX MOTORS · BUYER WORKSPACE</div>
          <h1>Good morning, {dashboard.user.displayName.split(' ')[0]}</h1>
          <p>Your purchase activity, supplier responses, and items that need attention.</p>
        </div>
        <div className="heading-actions"><span className="role-chip">Buyer · {dashboard.user.role.replace('buyer_', '').replaceAll('_', ' ')}</span></div>
      </div>

      <section className="summary-grid buyer-summary" aria-label="Buyer summary">
        <SummaryCard label="Total purchase orders" value={metrics.totalOrders} detail="In this workspace" icon="▤" />
        <SummaryCard label="Pending orders" value={metrics.pendingOrders} detail="Awaiting supplier response" icon="◷" />
        <SummaryCard label="Orders in progress" value={metrics.inProgressOrders} detail="Confirmed or being fulfilled" icon="⇢" />
        <SummaryCard label="Open issues" value={metrics.ordersNeedingAttention} detail="Orders flagged for attention" icon="⚑" />
        <SummaryCard label="Pending buyer approvals" value={metrics.pendingApprovals} detail="Read-only approval status" icon="✓" restricted={metrics.pendingApprovals == null} />
      </section>

      <div className="dashboard-columns buyer-columns">
        <section className="content-card orders-card">
          <div className="section-heading"><div><h2>Recent purchase orders</h2><p>Latest order records associated with Apex Motors.</p></div><span className="section-count">{dashboard.recentOrders.length} records</span></div>
          <OrdersTable orders={dashboard.recentOrders} />
        </section>
        <section className="content-card activity-card">
          <div className="section-heading"><div><h2>Recent activity</h2><p>Activity recorded for this company.</p></div><span className="section-icon">◷</span></div>
          <ActivityList items={dashboard.recentActivity} />
        </section>
      </div>
      {!canReviewApprovals && <p className="permission-note">Approval counts are hidden because your role does not include buyer approval access.</p>}
      <footer className="dashboard-footer">Synthetic demonstration data · No live partner systems are connected</footer>
    </div>
  );
}
