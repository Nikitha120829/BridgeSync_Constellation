export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export function formatRole(role) {
  return role.split('_').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

export function SummaryCard({ label, value, detail, icon, restricted = false }) {
  const formatted = value == null ? '—' : new Intl.NumberFormat().format(value);
  return (
    <article className="summary-card">
      <div className="summary-card-top"><span className="summary-label">{label}</span><span className="summary-icon" aria-hidden="true">{icon}</span></div>
      <div className="summary-value">{formatted}</div>
      <div className={restricted ? 'summary-detail restricted' : 'summary-detail'}>{restricted ? 'Not permitted for your role' : detail}</div>
    </article>
  );
}

export function StatusBadge({ status }) {
  const labels = {
    pending_supplier_confirmation: ['Pending supplier', 'amber'],
    confirmed: ['Confirmed', 'teal'],
    in_progress: ['In progress', 'blue'],
    needs_attention: ['Needs attention', 'red'],
    rejected: ['Rejected', 'red'],
    complete: ['Complete', 'green'],
  };
  const [label, tone] = labels[status] ?? [status?.replaceAll('_', ' ') ?? 'Unknown', 'grey'];
  return <span className={`status-badge ${tone}`}>{label}</span>;
}

export function LoadingPanel({ label = 'Loading workspace data' }) {
  return <div className="state-panel" role="status"><span className="loading-spinner" />{label}</div>;
}

export function ErrorPanel({ message, onRetry }) {
  return (
    <div className="state-panel error-panel" role="alert">
      <div><strong>We couldn’t load this dashboard.</strong><p>{message}</p></div>
      <button className="button secondary" type="button" onClick={onRetry}>Try again</button>
    </div>
  );
}

export function ActivityList({ items }) {
  if (!items.length) return <div className="empty-state">No activity recorded yet.</div>;
  const eventLabels = { login_success: 'signed in', logout: 'signed out', authorization_denied: 'was denied access to a protected action' };
  return (
    <ul className="activity-list">
      {items.map((item) => (
        <li key={item.id}>
          <span className="activity-symbol" aria-hidden="true">{item.action === 'login_success' ? '↗' : item.action === 'logout' ? '↘' : '•'}</span>
          <span className="activity-copy"><strong>{item.actor}</strong> {eventLabels[item.action] ?? 'recorded an activity'}{item.details && item.action !== 'authorization_denied' ? ` · ${item.details}` : ''}<small>{formatDate(item.occurredAt)}</small></span>
        </li>
      ))}
    </ul>
  );
}

export function PlannedAction({ children, detail = 'Available in a later milestone' }) {
  return (
    <button className="planned-action" type="button" disabled title={detail}>
      <span>{children}</span><small>{detail}</small>
    </button>
  );
}
