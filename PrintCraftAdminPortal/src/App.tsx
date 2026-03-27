import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CmsPage from './pages/CmsPage';
import AdminQueuePage from './pages/QueuePage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import BulkOrdersPage from './pages/BulkOrdersPage';
import { getSession, isAdminRole } from './auth/adminAuth';

export default function App() {
  const location = useLocation();
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setAuthVersion((v) => v + 1);
    window.addEventListener('admin-auth-changed', refresh);
    return () => window.removeEventListener('admin-auth-changed', refresh);
  }, []);

  const session = getSession();
  const isAuthenticated = !!session && isAdminRole(session.role);
  const onLogin = () => setAuthVersion((v) => v + 1);

  // if (!isAuthenticated && location.pathname !== '/login') {
  //   return <Navigate to="/login" replace />;
  // }

  // if (isAuthenticated && location.pathname === '/login') {
  //   return <Navigate to="/" replace />;
  // }

  // if (location.pathname === '/login') {
  //   return <LoginPage onLogin={onLogin} key={authVersion} />;
  // }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-4 px-4 py-5 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />

      <main className="min-w-0 overflow-hidden">
        <AdminTopbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          >
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/bulk-orders" element={<BulkOrdersPage />} />
              <Route path="/queue" element={<AdminQueuePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/cms" element={<CmsPage />} />
              <Route path="/users" element={<UsersPage />} />
              {/* <Route path="/login" element={<LoginPage onLogin={onLogin} />} /> */}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
