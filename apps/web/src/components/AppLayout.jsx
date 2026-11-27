import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { BridgeSyncMark, CompanyMark } from './Brand.jsx';

const buyerNavigation = [
  ['Overview', '/buyer', '⌂', true], ['Purchase Orders', '/buyer/orders', '▤'], ['Supplier Availability', '/buyer/availability', '◉'],
  ['Issues and Exceptions', '/buyer/issues', '⚑'], ['Shipment Tracking', '/buyer/shipments', '⇢'], ['Shared Workspace', '/buyer/workspace', '◫'],
  ['Invoices and Payments', '/buyer/finance', '＄'], ['Buyer Approvals', '/buyer/approvals', '✓'], ['Activity History', '/buyer/activity', '◷'],
];
const supplierNavigation = [
  ['Overview', '/supplier', '⌂', true], ['Inventory Management', '/supplier/inventory', '▦'], ['Incoming Orders', '/supplier/orders', '▤'],
  ['Supply Proposals', '/supplier/proposals', '◈'], ['Shipment Management', '/supplier/shipments', '⇢'], ['Issues and Exceptions', '/supplier/issues', '⚑'],
  ['Shared Workspace', '/supplier/workspace', '◫'], ['Invoices and Payments', '/supplier/finance', '＄'], ['Supplier Approvals', '/supplier/approvals', '✓'],
  ['Activity History', '/supplier/activity', '◷'],
];

function roleLabel(role) {
  return role.split('_').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isBuyer = user.company.type === 'buyer';
  const navigation = isBuyer ? buyerNavigation : supplierNavigation;
  const visibleNavigation = navigation;

  async function handleLogout() {
    try {
      await logout();
      window.location.assign('/');
    } catch {
      setProfileOpen(false);
    }
  }

  return (
    <div className={`app-shell${mobileNavOpen ? ' mobile-nav-open' : ''}`}>
      <aside className="app-sidebar">
        <Link className="app-brand" to="/" aria-label="BridgeSync home">
          <BridgeSyncMark />
          <span>BridgeSync</span>
        </Link>
        <div className="workspace-identity">
          <CompanyMark>{user.company.mark}</CompanyMark>
          <span><strong>{user.company.name}</strong><small>{isBuyer ? 'Buyer workspace' : 'Supplier workspace'}</small></span>
        </div>
        <p className="sidebar-label">WORKSPACE</p>
        <nav className="app-navigation" aria-label={`${user.company.name} navigation`}>
          {visibleNavigation.map(([label, href, icon, active]) => active === true ? (
            <NavLink key={href} to={href} end onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ) : (
            <span key={href} className="app-nav-link planned" aria-disabled="true" title="Planned for a later milestone">
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span><small>Later</small>
            </span>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="sidebar-status-dot" />
          <span>Secure company workspace</span>
          <span className="sidebar-version">DEMO</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-leading">
            <button className="mobile-nav-toggle" type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileNavOpen}>{mobileNavOpen ? '×' : '☰'}</button>
            <div className="topbar-context"><span>Workspace</span><span className="context-divider">/</span><strong>Overview</strong></div>
          </div>
          <div className="topbar-actions">
            <span className="connection-indicator"><i /> Local demo</span>
            <div className="profile-wrap">
              <button className="profile-button" type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
                <span className="user-avatar">{user.displayName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                <span className="profile-identity"><strong>{user.displayName}</strong><small>{roleLabel(user.role)}</small></span>
                <span className="profile-chevron" aria-hidden="true">⌄</span>
              </button>
              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-user"><strong>{user.displayName}</strong><span>{user.email}</span></div>
                  <button type="button" onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="app-content"><Outlet /></main>
      </div>
      {mobileNavOpen && <button className="mobile-backdrop" type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
    </div>
  );
}
