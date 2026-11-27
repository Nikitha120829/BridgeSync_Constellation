import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { BridgeSyncMark, CompanyMark } from './components/Brand.jsx';

const workspaces = [
  { value: 'apex-motors', name: 'Apex Motors', mark: 'AM' },
  { value: 'nova-components', name: 'Nova Components', mark: 'NC' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [workspace, setWorkspace] = useState(workspaces[0].value);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [messageKind, setMessageKind] = useState('error');
  const [submitting, setSubmitting] = useState(false);
  const selectedWorkspace = workspaces.find((item) => item.value === workspace) ?? workspaces[0];

  function validate() {
    const nextErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) nextErrors.email = 'Enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid work email address.';
    }
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateEmail() {
    const trimmedEmail = email.trim();
    const emailError = !trimmedEmail
      ? 'Enter your work email.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
        ? 'Enter a valid work email address.'
        : '';
    setErrors((current) => ({ ...current, email: emailError }));
  }

  function validatePassword() {
    setErrors((current) => ({ ...current, password: password ? '' : 'Enter your password.' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormMessage('');
    setMessageKind('error');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login({
        email: email.trim(),
        password,
        workspaceContext: workspace,
        remember,
      });
      setPassword('');
      navigate(user.company.type === 'buyer' ? '/buyer' : '/supplier', { replace: true });
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleForgotPassword(event) {
    event.preventDefault();
    setMessageKind('info');
    setFormMessage('Password recovery is not available yet. Contact your workspace administrator.');
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (errors.email) setErrors((current) => ({ ...current, email: '' }));
    setFormMessage('');
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    if (errors.password) setErrors((current) => ({ ...current, password: '' }));
    setFormMessage('');
  }

  return (
    <main className="login-page">
      <div className="page-glow page-glow-one" aria-hidden="true" />
      <div className="page-glow page-glow-two" aria-hidden="true" />
      <div className="login-layout">
        <section className="form-panel" aria-labelledby="welcome-heading">
          <a className="brand-lockup" href="/" aria-label="BridgeSync home">
            <BridgeSyncMark />
            <span>BridgeSync</span>
          </a>

          <div className="form-content">
            <div className="eyebrow"><span className="eyebrow-dot" /> PARTNER OPERATIONS, IN SYNC</div>
            <h1 id="welcome-heading">Welcome back</h1>
            <p className="intro-copy">Sign in to your workspace to coordinate with your trusted partners.</p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="workspace">Company workspace</label>
                <div className="select-wrap">
                  <CompanyMark>{selectedWorkspace.mark}</CompanyMark>
                  <select
                    id="workspace"
                    name="workspaceContext"
                    value={workspace}
                    onChange={(event) => {
                      setWorkspace(event.target.value);
                      setFormMessage('');
                    }}
                    aria-describedby="workspace-help"
                  >
                    {workspaces.map((item) => (
                    <option key={item.value} value={item.value}>{item.name} workspace</option>
                    ))}
                  </select>
                  <span className="select-chevron" aria-hidden="true">⌄</span>
                </div>
                <p className="field-hint" id="workspace-help">
                  <span className="shield-icon" aria-hidden="true">✓</span>
                  Workspace is context only. Your account determines company access and role.
                </p>
              </div>

              <div className="field-group">
                <label htmlFor="email">Work email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={validateEmail}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
              </div>

              <div className="field-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <a className="text-link" href="#forgot-password" onClick={handleForgotPassword}>Forgot password?</a>
                </div>
                <div className={'password-wrap' + (errors.password ? ' has-error' : '')}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={validatePassword}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <span className="field-error" id="password-error">{errors.password}</span>}
              </div>

              <label className="remember-option">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                <span className="custom-checkbox" aria-hidden="true">{remember ? '✓' : ''}</span>
                <span>Remember me</span>
              </label>

              {formMessage && (
                <div className={'form-message ' + messageKind} role={messageKind === 'error' ? 'alert' : 'status'} aria-live="polite">
                  <span className="message-icon" aria-hidden="true">{messageKind === 'error' ? '!' : 'i'}</span>
                  {formMessage}
                </div>
              )}

              <button className="sign-in-button" type="submit" disabled={submitting}>
                <span>{submitting ? 'Verifying account…' : 'Sign in securely'}</span>
                <span aria-hidden="true">{submitting ? '' : '→'}</span>
              </button>
            </form>

            <p className="access-help">Need access? Contact your workspace administrator.</p>
          </div>

          <footer className="form-footer">
            <span>© 2026 BridgeSync</span>
            <span className="footer-separator">·</span>
            <span className="demo-note"><span className="demo-dot" /> Synthetic demo environment</span>
          </footer>
        </section>

        <aside className="story-panel" aria-label="BridgeSync partner collaboration">
          <div className="story-topline">
            <span className="secure-pill"><span className="secure-dot" /> COLLABORATION WITH CLEAR BOUNDARIES</span>
          </div>
          <div className="story-copy">
            <p className="story-kicker">A shared view. Clear boundaries.</p>
            <h2>Complex partnerships,<br /><span>working as one.</span></h2>
            <p className="story-description">Coordinate operational decisions across organizations while each partner stays in control of its own systems and data.</p>
          </div>

          <div className="connection-card">
            <div className="connection-header">
              <div>
                <p className="connection-overline">PARTNER CONNECTIONS</p>
                <h3>Authorized by each organization</h3>
              </div>
              <span className="connection-status"><span /> Partner-owned</span>
            </div>
            <div className="partner-flow">
              <div className="partner-node">
                <CompanyMark>AM</CompanyMark>
                <span><strong>Apex Motors</strong><small>Buyer workspace</small></span>
              </div>
              <div className="flow-link" aria-hidden="true"><i /><i /><i /></div>
              <div className="bridge-node"><BridgeSyncMark /><span>BridgeSync</span></div>
              <div className="flow-link" aria-hidden="true"><i /><i /><i /></div>
              <div className="partner-node">
                <CompanyMark>NC</CompanyMark>
                <span><strong>Nova Components</strong><small>Supplier workspace</small></span>
              </div>
            </div>
            <div className="connection-foot"><span className="mini-check">✓</span> Only approved information crosses the partnership boundary</div>
          </div>

          <div className="trust-row">
            <div className="trust-item"><span className="trust-icon">⌑</span><span><strong>Partner controlled</strong><small>Organizations choose what to share</small></span></div>
            <div className="trust-item"><span className="trust-icon">◷</span><span><strong>Decision traceable</strong><small>Approvals leave a clear history</small></span></div>
          </div>
          <div className="story-footer"><span>Designed for trusted collaboration</span><span className="story-footer-mark">BS / 01</span></div>
        </aside>
      </div>
    </main>
  );
}
