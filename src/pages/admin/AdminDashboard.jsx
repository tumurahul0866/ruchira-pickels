import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, LogOut, TrendingUp,
  Users, Settings, CreditCard, Star, Bell, Globe, User, Key, Plus,
  ChevronRight, IndianRupee
} from 'lucide-react';
import { getProducts, getOrders } from '../../services/dataStore';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import StoreSettings from './StoreSettings';
import AddPickle from './AddPickle';
import PaymentSettings from './PaymentSettings';
import ReviewsManagement from './ReviewsManagement';
import CustomersManagement from './CustomersManagement';
import ApplyOffers from './ApplyOffers';
import AdminProfile from './AdminProfile';
import ChangePassword from './ChangePassword';
import ChangePictures from './ChangePictures';

const navItems = [
  { id: 'overview',          label: 'Dashboard',       icon: LayoutDashboard, group: 'main' },
  { id: 'products',          label: 'Products',         icon: Package,         group: 'catalog' },
  { id: 'orders',            label: 'Orders',           icon: ShoppingBag,     group: 'catalog' },
  { id: 'payments',          label: 'Payments',         icon: CreditCard,      group: 'store' },
  { id: 'offers',            label: 'Coupons & Offers', icon: Bell,            group: 'store' },
  { id: 'reviews',           label: 'Reviews',          icon: Star,            group: 'store' },
  { id: 'customers',         label: 'Customers',        icon: Users,           group: 'store' },
  { id: 'website-settings',  label: 'Store Settings',   icon: Settings,        group: 'settings' },
  { id: 'pictures',          label: 'Website Images',   icon: Globe,           group: 'settings' },
  { id: 'admin-profile',     label: 'Admin Profile',    icon: User,            group: 'settings' },
  { id: 'change-password',   label: 'Admin Password/Email', icon: Key,         group: 'settings' },
];

const groups = [
  { key: 'main',     label: null },
  { key: 'catalog',  label: 'Catalog' },
  { key: 'store',    label: 'Store' },
  { key: 'settings', label: 'Settings' },
];

// Stat card colours
const statConfig = [
  { key: 'totalRevenue',   label: 'Revenue',        color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/30', textColor: 'text-amber-400',  prefix: '₹', formatter: (v) => v.toLocaleString() },
  { key: 'totalOrders',    label: 'Total Orders',   color: 'from-sky-500/20 to-sky-600/5',    border: 'border-sky-500/30',   textColor: 'text-sky-400',    prefix: '',  formatter: (v) => v },
  { key: 'pendingOrders',  label: 'Pending',        color: 'from-rose-500/20 to-rose-600/5',  border: 'border-rose-500/30',  textColor: 'text-rose-400',   prefix: '',  formatter: (v) => v },
  { key: 'deliveredOrders',label: 'Delivered',      color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', textColor: 'text-emerald-400', prefix: '', formatter: (v) => v },
  { key: 'todayOrders',    label: 'Today\'s Orders',color: 'from-violet-500/20 to-violet-600/5', border: 'border-violet-500/30', textColor: 'text-violet-400', prefix: '', formatter: (v) => v },
  { key: 'lowStock',       label: 'Low Stock',      color: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/30', textColor: 'text-orange-400', prefix: '', formatter: (v) => v },
];

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, pendingOrders: 0,
    deliveredOrders: 0, cancelledOrders: 0, todayOrders: 0, lowStock: 0, totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      if (!isAdmin) return;
      const products = await getProducts();
      const orders = getOrders();
      const today = new Date().toISOString().slice(0, 10);
      const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
      const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;
      const pendingOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
      const lowStock = products.filter((p) => p.stockQuantity <= 8 && p.visible).length;
      const todayOrders = orders.filter((o) => o.date.slice(0, 10) === today).length;
      const totalRevenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + Number(o.totalAmount), 0);
      setStats({ totalProducts: products.length, totalOrders: orders.length, pendingOrders, deliveredOrders, cancelledOrders, todayOrders, lowStock, totalRevenue });
      setRecentOrders(orders.slice(-6).reverse());
    };

    loadStats();
  }, [isAdmin, activeTab]);

  const handleLogout = () => { logout(); navigate('/admin-login'); };
  const handleNav = (id) => { setActiveTab(id); setSidebarOpen(false); };

  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  const statusBadge = (status) => {
    const map = {
      Pending:    'bg-amber-500/15 text-amber-400 border-amber-500/30',
      Processing: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      Delivered:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      Cancelled:  'bg-rose-500/15 text-rose-400 border-rose-500/30',
    };
    return map[status] || 'bg-white/10 text-brand-cream/60 border-white/10';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':       return <Overview stats={stats} recentOrders={recentOrders} setActiveTab={setActiveTab} statusBadge={statusBadge} />;
      case 'products':       return <ManageProducts />;
      case 'orders':         return <ManageOrders />;
      case 'payments':       return <PaymentSettings />;
      case 'reviews':        return <ReviewsManagement />;
      case 'customers':      return <CustomersManagement />;
      case 'offers':         return <ApplyOffers />;
      case 'website-settings': return <StoreSettings />;
      case 'pictures':       return <ChangePictures />;
      case 'admin-profile':  return <AdminProfile />;
      case 'change-password': return <ChangePassword />;
      default: return null;
    }
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : ''}`}>
      {/* Logo & Brand */}
      <div className="p-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 mb-3 group" onClick={() => setSidebarOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center font-serif font-bold text-brand-gold">
            K
          </div>
          <div>
            <p className="font-serif font-bold text-brand-cream text-sm leading-tight group-hover:text-brand-gold transition-colors">Konasema Ruchulu</p>
            <p className="text-[10px] text-brand-cream/40 uppercase tracking-widest">Admin Portal</p>
          </div>
        </Link>
        <div className="px-3 py-2 rounded-xl bg-brand-gold/5 border border-brand-gold/10">
          <p className="text-[10px] uppercase tracking-widest text-brand-gold/60 font-bold">Control Center</p>
          <p className="text-xs text-brand-cream/50 mt-0.5">Manage store & operations</p>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group.key);
          return (
            <div key={group.key}>
              {group.label && (
                <p className="px-3 mb-1.5 text-[9px] uppercase tracking-[0.25em] font-bold text-brand-cream/25">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-gold/15 to-brand-gold/5 text-brand-gold border border-brand-gold/20 shadow-sm'
                          : 'text-brand-cream/60 hover:bg-white/5 hover:text-brand-cream/90'
                      }`}
                    >
                      <Icon size={15} className={isActive ? 'text-brand-gold' : 'text-brand-cream/40'} />
                      <span className="truncate">{item.label}</span>
                      {isActive && <ChevronRight size={12} className="ml-auto text-brand-gold/60" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-brand-red/70 hover:bg-brand-red/8 hover:text-brand-red transition-all text-sm font-semibold"
        >
          <LogOut size={15} /> Logout Admin
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-brand-black text-brand-cream">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#0f0f0f] border-r border-white/5">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#0f0f0f] border-r border-white/5 z-50 md:hidden"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-[#0f0f0f] border-b border-white/5 px-4 py-3.5 flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-xl bg-white/5 text-brand-cream/70 hover:bg-white/10"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="font-serif font-bold text-brand-cream text-base md:text-xl tracking-wide">
              {navItems.find((n) => n.id === activeTab)?.label || 'Admin Portal'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-cream/60 text-xs font-medium transition-all">
              View Site →
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-brand-red/10 hover:bg-brand-red/20 text-brand-red text-xs font-bold transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/* ─── Overview Tab ──────────────────────────────────────────── */
const Overview = ({ stats, recentOrders, setActiveTab, statusBadge }) => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-cream">
        Dashboard Overview
      </h1>
      <p className="text-brand-cream/50 mt-1.5 text-sm">
        Track product activity, order flow and store performance in one premium admin console.
      </p>
    </div>

    {/* Stat Cards */}
    <div className="grid gap-4 grid-cols-2 xl:grid-cols-3">
      {statConfig.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className={`p-6 rounded-3xl bg-gradient-to-br ${s.color} border ${s.border} backdrop-blur-sm`}
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-cream/40 mb-3 font-bold">{s.label}</p>
          <p className={`text-3xl md:text-4xl font-bold font-mono ${s.textColor}`}>
            {s.prefix}{s.formatter(stats[s.key])}
          </p>
        </motion.div>
      ))}
    </div>

    {/* Recent Orders */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.35 }}
      className="rounded-3xl border border-white/8 bg-[#0f0f0f] overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-cream/40 mb-1 font-bold">Activity</p>
          <h2 className="text-xl font-serif font-bold text-brand-cream">Recent Orders</h2>
        </div>
        <button
          onClick={() => setActiveTab('orders')}
          className="text-brand-gold hover:text-brand-gold-light text-xs font-bold flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-white/5">
            <tr>
              {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Date'].map((h) => (
                <th key={h} className="py-3 px-5 text-left text-[10px] uppercase tracking-widest text-brand-cream/30 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-brand-cream/30 text-sm">
                  No orders yet. Orders will appear here once customers start placing them.
                </td>
              </tr>
            ) : (
              recentOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="py-4 px-5 font-mono text-xs text-brand-gold">{order.id}</td>
                  <td className="py-4 px-5 text-brand-cream/80">{order.customer?.name || 'Guest'}</td>
                  <td className="py-4 px-5 font-bold text-brand-cream">₹{order.totalAmount}</td>
                  <td className="py-4 px-5 text-brand-cream/60 text-xs">{order.customer?.paymentMethod || '—'}</td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${statusBadge(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-brand-cream/50 text-xs">{new Date(order.date).toLocaleDateString()}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

export default AdminDashboard;
