import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import AppLayout from './components/AppLayout.jsx';
import { LoadingPanel } from './components/DashboardComponents.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import LoginPage from './LoginPage.jsx';
import SupplierDashboard from './pages/SupplierDashboard.jsx';

function homeFor(user) {
  return user?.company.type === 'supplier' ? '/supplier' : '/buyer';
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingPanel label="Checking your sign-in status" />;
  return user ? <Navigate to={homeFor(user)} replace /> : <LoginPage />;
}

function ProtectedCompanyRoute({ type }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingPanel label="Checking your workspace access" />;
  if (!user) return <Navigate to="/" replace />;
  if (user.company.type !== type) return <Navigate to={homeFor(user)} replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route element={<ProtectedCompanyRoute type="buyer" />}>
        <Route path="/buyer" element={<AppLayout />}><Route index element={<BuyerDashboard />} /></Route>
      </Route>
      <Route element={<ProtectedCompanyRoute type="supplier" />}>
        <Route path="/supplier" element={<AppLayout />}><Route index element={<SupplierDashboard />} /></Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}