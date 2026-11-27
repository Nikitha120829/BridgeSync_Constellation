export function BridgeSyncMark({ className = 'brand-mark' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" role="img" aria-label="BridgeSync">
      <rect width="40" height="40" rx="12" fill="currentColor" />
      <path d="M9 24.5h5.2c2.2 0 3.7-1.3 3.7-3.3s-1.5-3.2-3.7-3.2H9m12.1 6.5h2.2c3.6 0 5.7-2 5.7-5s-2.1-5-5.7-5h-2.2m-3.2 0v10m3.2-10v10m-9.3 5h17.4" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CompanyMark({ children, className = '' }) {
  return <span className={`company-mark ${className}`} aria-hidden="true">{children}</span>;
}
