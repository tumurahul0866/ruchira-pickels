import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, LogOut, Settings,
  CreditCard, Star, Bell, Globe, User, Key, ChevronRight, Users
} from 'lucide-react';
import { getProducts, getOrders } from '../../services/dataStore';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import StoreSettings from './StoreSettings';
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

const statConfig = [
  {
    key: 'totalProducts',
    label: 'Total Products',
    prefix: '',
    formatter: (value) => value.toLocaleString(),
    border: 'border-white/10',
    textColor: 'text-brand-cream'
  },
  {
    key: 'totalOrders',
    label: 'Orders Placed',
    prefix: '',
    formatter: (value) => value.toLocaleString(),
    border: 'border-white/10',
    textColor: 'text-brand-cream'
  },
  {
    key: 'totalRevenue',
    label: 'Revenue',
    prefix: '₹',
    formatter: (value) => Number(value).toLocaleString(),
    border: 'border-white/10',
    textColor: 'text-brand-cream'
  }
];

const Sidebar = ({ mobile = false, activeTab, onNav, onClose, onLogout }) => (
  <div className={`flex flex-col h-full ${mobile ? '' : ''}`}>
    <div className="p-5 border-b border-white/5">
      <Link to="/" className="flex items-center gap-3 mb-3 group" onClick={onClose}>
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
                    onClick={() => {
                      onNav(item.id);
                      if (mobile) onClose();
                    }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center gap-3 ${mobile ? 'px-4 py-3 text-base' : 'px-3.5 py-2.5 text-sm'} rounded-xl text-left font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-gold/15 to-brand-gold/5 text-brand-gold border border-brand-gold/20 shadow-sm'
                        : (mobile ? 'text-brand-cream/90 hover:bg-white/5 hover:text-brand-cream' : 'text-brand-cream/60 hover:bg-white/5 hover:text-brand-cream/90')
                    }`}
                  >
                    <Icon size={mobile ? 16 : 15} className={isActive ? 'text-brand-gold' : (mobile ? 'text-brand-cream/70' : 'text-brand-cream/40')} />
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

    <div className="p-3 border-t border-white/5">
      <motion.button
        onClick={onLogout}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-brand-red/70 hover:bg-brand-red/8 hover:text-brand-red transition-all text-sm font-semibold"
      >
        <LogOut size={15} /> Logout Admin
      </motion.button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, pendingOrders: 0,
    deliveredOrders: 0, cancelledOrders: 0, todayOrders: 0, lowStock: 0, totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      if (!isAdmin) return;
      try {
        const products = Array.isArray(await getProducts()) ? await getProducts() : [];
        const rawOrders = await getOrders();
        const ordersData = Array.isArray(rawOrders)
          ? [...rawOrders].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
          : [];
        const today = new Date().toISOString().slice(0, 10);
        const deliveredOrders = ordersData.filter((o) => o.status === 'Delivered').length;
        const cancelledOrders = ordersData.filter((o) => o.status === 'Cancelled').length;
        const pendingOrders = ordersData.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
        const lowStock = products.filter((p) => Number(p.stockQuantity) <= 8 && p.visible).length;
        const todayOrders = ordersData.filter((o) => (o.date || '').slice(0, 10) === today).length;
        const totalRevenue = ordersData.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + Number(o.totalAmount || 0), 0);
        setStats({ totalProducts: products.length, totalOrders: ordersData.length, pendingOrders, deliveredOrders, cancelledOrders, todayOrders, lowStock, totalRevenue });
        setOrders(ordersData);
        setRecentOrders(ordersData.slice(0, 10));
      } catch (error) {
        console.error('Failed to load admin stats:', error);
        setStats({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, cancelledOrders: 0, todayOrders: 0, lowStock: 0, totalRevenue: 0 });
        setOrders([]);
        setRecentOrders([]);
      }
    };

    loadStats();
  }, [isAdmin, activeTab]);

  const handleLogout = () => { logout(); navigate('/admin-login'); };
  const handleNav = (id) => { setActiveTab(id); };

  // Lock page scroll while mobile sidebar is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [sidebarOpen]);

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
      case 'overview':       return <Overview stats={stats} orders={orders} recentOrders={recentOrders} setActiveTab={setActiveTab} statusBadge={statusBadge} />;
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

  return (
    <div className="min-h-screen flex bg-brand-matte text-brand-black">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-brand-cream border-r border-brand-gold/20">
        <Sidebar activeTab={activeTab} onNav={handleNav} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 border-r border-brand-gold/20 z-50 md:hidden"
              style={{ backgroundColor: '#f7eee3' }}
              role="dialog"
              aria-modal="true"
            >
              <Sidebar mobile activeTab={activeTab} onNav={handleNav} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-brand-cream border-b border-brand-gold/20 px-4 py-3.5 flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-xl bg-brand-gold/10 text-brand-black hover:bg-brand-gold/20"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="font-serif font-bold text-brand-black text-base md:text-xl tracking-wide">
              {navItems.find((n) => n.id === activeTab)?.label || 'Admin Portal'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-black text-xs font-medium transition-all">
              View Site →
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-brand-gold text-brand-black text-xs font-bold transition-all hover:bg-brand-gold-light"
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
const Overview = ({ stats, orders = [], recentOrders, setActiveTab, statusBadge }) => {
  const lastSixMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString('en-US', { month: 'short' }),
    };
  });

  const monthlySales = lastSixMonths.map((month) => ({
    label: month.label,
    value: orders.reduce((sum, order) => {
      const orderKey = `${new Date(order.date).getFullYear()}-${new Date(order.date).getMonth()}`;
      return orderKey === month.key && order.status !== 'Cancelled'
        ? sum + Number(order.totalAmount)
        : sum;
    }, 0),
  }));

  const maxSales = Math.max(...monthlySales.map((item) => item.value), 1);
  const linePoints = monthlySales.map((item, index) => {
    const x = 40 + index * 45;
    const y = 140 - (item.value / maxSales) * 110;
    return `${x},${y}`;
  }).join(' ');

  const productSales = orders.reduce((acc, order) => {
    if (!Array.isArray(order.items)) return acc;
    order.items.forEach((item) => {
      const name = item.product?.name || item.product || 'Unknown';
      acc[name] = (acc[name] || 0) + Number(item.quantity || 1);
    });
    return acc;
  }, {});

  const topSelling = Object.entries(productSales)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusItems = Object.entries(statusCounts).map(([status, value]) => ({ status, value }));
  const totalStatus = statusItems.reduce((sum, item) => sum + item.value, 0);
  let statusPosition = 0;
  const statusBackground = statusItems
    .map((item) => {
      const start = statusPosition;
      const slice = totalStatus ? (item.value / totalStatus) * 100 : 0;
      statusPosition += slice;
      const color = item.status === 'Delivered' ? '#22c55e'
        : item.status === 'Processing' ? '#38bdf8'
        : item.status === 'Cancelled' ? '#f43f5e'
        : '#f59e0b';
      return `${color} ${start}% ${statusPosition}%`;
    })
    .join(', ');

  const activeStats = statConfig.map((item) => ({
    ...item,
    value: stats[item.key] ?? 0,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-cream">
          Dashboard Overview
        </h1>
        <p className="text-brand-cream/50 mt-1.5 text-sm">
          Track product activity, order flow and store performance in one premium admin console.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3">
          {activeStats.map((item) => (
            <div key={item.key} className={`rounded-3xl border ${item.border} bg-brand-cream/95 p-5`}>
              <p className={item.textColor + ' text-sm font-semibold'}>{item.label}</p>
              <p className="mt-4 text-3xl font-serif font-bold text-brand-black">{item.prefix}{item.formatter(item.value)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-brand-gold/20 bg-brand-cream/95 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-black/40 mb-2 font-bold">Large Line Chart</p>
              <h2 className="text-2xl font-serif font-bold text-brand-black">Monthly Sales</h2>
              <p className="text-sm text-brand-black/60 mt-1">Revenue by month for the most recent six-month period.</p>
            </div>
            <div className="rounded-full bg-brand-gold/15 border border-brand-gold/30 px-4 py-2 text-sm font-semibold text-brand-black">
              Total Sales ₹{monthlySales.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl bg-brand-cream/95 p-4">
            <div className="relative h-52">
              <svg viewBox="0 0 320 180" className="w-full h-full">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                <path
                  d={`M${linePoints}`}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <polyline points={linePoints} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                {monthlySales.map((item, index) => {
                  const x = 40 + index * 45;
                  const y = 140 - (item.value / maxSales) * 110;
                  return (
                    <g key={item.label}>
                      <circle cx={x} cy={y} r="5" fill="#FACC15" />
                      <circle cx={x} cy={y} r="10" fill="rgba(250, 204, 21, 0.08)" />
                    </g>
                  );
                })}
                {monthlySales.map((item, index) => (
                  <text
                    key={`${item.label}-label`}
                    x={40 + index * 45}
                    y="168"
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="10"
                  >
                    {item.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-brand-gold/20 bg-brand-cream/95 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-black/40 mb-2 font-bold">Bar Chart</p>
                <h3 className="text-xl font-semibold text-brand-black">Top Selling Pickles</h3>
              </div>
              <span className="text-xs font-semibold text-brand-black/60">Top 5 Products</span>
            </div>
            <div className="space-y-4">
              {topSelling.length === 0 ? (
                <p className="text-sm text-brand-cream/50">No sales data available yet.</p>
              ) : (
                topSelling.map((item) => {
                  const barWidth = Math.max((item.count / Math.max(...topSelling.map((row) => row.count))) * 100, 10);
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-brand-cream/60">
                        <span className="truncate max-w-[150px]">{item.name}</span>
                        <span className="font-semibold text-brand-cream">{item.count}</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-brand-gold/20 bg-brand-cream/95 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-black/40 mb-2 font-bold">Pie Chart</p>
                <h3 className="text-xl font-semibold text-brand-black">Order Status</h3>
              </div>
              <span className="text-xs font-semibold text-brand-black/60">Current Distribution</span>
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="h-40 w-40 rounded-full border border-brand-gold/20 bg-brand-cream/95" style={{ background: totalStatus ? `conic-gradient(${statusBackground})` : '#334155' }} />
              <div className="grid gap-3 flex-1">
                {statusItems.length === 0 ? (
                  <p className="text-sm text-brand-cream/50">No orders placed yet.</p>
                ) : (
                  statusItems.map((item) => {
                    const color = item.status === 'Delivered' ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20'
                      : item.status === 'Processing' ? 'bg-sky-400/15 text-sky-300 border-sky-400/20'
                      : item.status === 'Cancelled' ? 'bg-rose-400/15 text-rose-300 border-rose-400/20'
                      : 'bg-amber-400/15 text-amber-300 border-amber-400/20';
                    return (
                      <div key={item.status} className={`rounded-3xl border px-4 py-3 ${color}`}>
                        <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                          <span>{item.status}</span>
                          <span>{item.value}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-current" style={{ width: `${totalStatus ? (item.value / totalStatus) * 100 : 0}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="rounded-3xl border border-brand-gold/20 bg-brand-cream/95 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-cream/40 mb-1 font-bold">Activity</p>
            <h2 className="text-xl font-serif font-bold text-brand-cream">Latest Orders</h2>
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
                    <td className="py-4 px-5 text-brand-cream/60 text-xs">{order.paymentMethod || order.customer?.paymentMethod || '—'}</td>
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
};

export default AdminDashboard;
