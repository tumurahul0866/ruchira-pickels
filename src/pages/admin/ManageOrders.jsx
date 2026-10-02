import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/dataStore';
import { ChevronDown, ChevronUp, Mail, MapPin, Package, Phone, RefreshCw, Search, Trash2 } from 'lucide-react';

const ORDER_STATUSES = ['Order Placed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid'];

const formatCurrency = (amount) => `₹${(Number(amount) || 0).toLocaleString('en-IN')}`;

const formatOrderDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const getItemPrice = (item) => Number(
  item.weightOption?.price ?? item.product?.pricePerUnit ?? item.product?.weights?.[0]?.price
) || 0;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [busyOrderId, setBusyOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    getOrders()
      .then((savedOrders) => {
        if (active) setOrders(Array.isArray(savedOrders) ? savedOrders : []);
      })
      .catch(() => {
        if (active) setError('Orders could not be loaded. Try refreshing.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const refreshOrders = async () => {
    const savedOrders = await getOrders();
    setOrders(Array.isArray(savedOrders) ? savedOrders : []);
  };

  const handleStatusChange = async (orderId, status) => {
    setBusyOrderId(orderId);
    setError('');
    setNotice('');
    try {
      await updateOrderStatus(orderId, status);
      await refreshOrders();
      setNotice(`Order ${orderId} updated.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Order status could not be updated.');
    } finally {
      setBusyOrderId(null);
    }
  };

  const handlePaymentChange = async (orderId, paymentStatus) => {
    setBusyOrderId(orderId);
    setError('');
    setNotice('');
    try {
      await updateOrderStatus(orderId, null, paymentStatus);
      await refreshOrders();
      setNotice(`Payment status for ${orderId} updated.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Payment status could not be updated.');
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Permanently delete order ${orderId}?`)) return;
    setBusyOrderId(orderId);
    setError('');
    setNotice('');
    try {
      await deleteOrder(orderId);
      setOrders((currentOrders) => currentOrders.filter((order) => String(order.id) !== String(orderId)));
      setNotice(`Order ${orderId} deleted.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Order could not be deleted.');
    } finally {
      setBusyOrderId(null);
    }
  };

  const query = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const customer = order.customer || {};
    const matchesSearch = !query || [
      order.id,
      customer.name,
      customer.email,
      customer.phone,
    ].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'All statuses' || (order.status || 'Order Placed') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const inProgressCount = orders.filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length;
  const pendingPaymentCount = orders.filter((order) => (order.paymentStatus || 'Pending') === 'Pending').length;
  const deliveredCount = orders.filter((order) => order.status === 'Delivered').length;
  const summary = [
    { label: 'All orders', value: orders.length },
    { label: 'In progress', value: inProgressCount },
    { label: 'Payment pending', value: pendingPaymentCount },
    { label: 'Delivered', value: deliveredCount },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-cream">Manage Orders</h1>
          <p className="mt-1 text-sm text-brand-cream/55">Search orders, update fulfillment and payment, or open details.</p>
        </div>
        <button
          type="button"
          onClick={() => refreshOrders().catch(() => setError('Orders could not be refreshed.'))}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs font-semibold text-brand-cream hover:border-brand-gold/50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </header>

      <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border border-white/10 bg-brand-black/30 md:grid-cols-4 md:divide-y-0">
        {summary.map((item) => (
          <div key={item.label} className="px-4 py-3">
            <p className="text-xl font-bold text-brand-cream">{item.value}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-cream/50">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-cream/45" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer, email or phone"
            aria-label="Search orders"
            className="w-full border border-white/15 bg-brand-black py-2.5 pl-9 pr-3 text-sm text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by order status"
          className="border border-white/15 bg-brand-black px-3 py-2.5 text-sm text-brand-cream focus:border-brand-gold focus:outline-none sm:w-52"
        >
          <option>All statuses</option>
          {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>

      {error && <div role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
      {notice && <div role="status" className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{notice}</div>}

      <div className="border border-white/10 bg-brand-matte">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-bold text-brand-cream">Order queue</h2>
          <span className="text-xs text-brand-cream/50">{filteredOrders.length} shown</span>
        </div>

        {loading ? (
          <p className="px-4 py-10 text-center text-sm text-brand-cream/50">Loading orders…</p>
        ) : filteredOrders.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-brand-cream/50">
            {orders.length === 0 ? 'No orders yet.' : 'No orders match these filters.'}
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredOrders.map((order) => {
              const customer = order.customer || {};
              const items = Array.isArray(order.items) ? order.items : [];
              const itemCount = items.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
              const expanded = String(expandedOrderId) === String(order.id);
              const busy = String(busyOrderId) === String(order.id);
              const status = order.status || 'Order Placed';
              const paymentStatus = order.paymentStatus || 'Pending';

              return (
                <section key={order.id}>
                  <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(130px,0.9fr)_minmax(160px,1.2fr)_minmax(100px,0.7fr)_minmax(155px,1fr)_minmax(155px,1fr)_auto] lg:items-center">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-bold text-brand-gold">{order.id}</p>
                      <p className="mt-1 text-xs text-brand-cream/50">{formatOrderDate(order.date)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-cream">{customer.name || 'Customer'}</p>
                      <p className="truncate text-xs text-brand-cream/50">{customer.email || customer.phone || 'Contact unavailable'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-cream">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-brand-cream/50">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-brand-cream/45">Fulfillment</span>
                      <select
                        value={status}
                        onChange={(event) => handleStatusChange(order.id, event.target.value)}
                        disabled={busy}
                        aria-label={`Fulfillment status for ${order.id}`}
                        className="w-full border border-white/15 bg-brand-black px-2 py-2 text-xs font-semibold text-brand-cream focus:border-brand-gold focus:outline-none disabled:opacity-50"
                      >
                        {!ORDER_STATUSES.includes(status) && <option value={status}>{status}</option>}
                        {ORDER_STATUSES.map((value) => <option key={value}>{value}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-brand-cream/45">Payment · {order.paymentMethod || 'COD'}</span>
                      <select
                        value={paymentStatus}
                        onChange={(event) => handlePaymentChange(order.id, event.target.value)}
                        disabled={busy}
                        aria-label={`Payment status for ${order.id}`}
                        className="w-full border border-white/15 bg-brand-black px-2 py-2 text-xs font-semibold text-brand-cream focus:border-brand-gold focus:outline-none disabled:opacity-50"
                      >
                        {!PAYMENT_STATUSES.includes(paymentStatus) && <option value={paymentStatus}>{paymentStatus}</option>}
                        {PAYMENT_STATUSES.map((value) => <option key={value}>{value}</option>)}
                      </select>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                        aria-expanded={expanded}
                        aria-label={`${expanded ? 'Hide' : 'Show'} details for ${order.id}`}
                        className="inline-flex items-center gap-1 border border-white/15 px-2.5 py-2 text-xs font-semibold text-brand-cream hover:border-brand-gold/50"
                      >
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={busy}
                        aria-label={`Delete order ${order.id}`}
                        title="Delete order"
                        className="grid h-9 w-9 place-items-center border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="grid gap-6 border-t border-white/10 bg-brand-black/25 px-4 py-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cream/55">Customer details</h3>
                        <p className="flex items-start gap-2 text-sm text-brand-cream"><Package size={15} className="mt-0.5 shrink-0 text-brand-gold" />{customer.name || 'Customer'}</p>
                        {customer.email && <p className="flex items-center gap-2 text-sm text-brand-cream/75"><Mail size={14} className="shrink-0 text-brand-cream/45" />{customer.email}</p>}
                        {customer.phone && <p className="flex items-center gap-2 text-sm text-brand-cream/75"><Phone size={14} className="shrink-0 text-brand-cream/45" />{customer.phone}</p>}
                        <p className="flex items-start gap-2 text-sm leading-relaxed text-brand-cream/75"><MapPin size={14} className="mt-0.5 shrink-0 text-brand-cream/45" />{[customer.address, customer.city, customer.state, customer.pincode].filter(Boolean).join(', ') || 'Address unavailable'}</p>
                        {customer.transactionId && <p className="text-xs text-brand-cream/60">UPI reference: <span className="font-mono text-brand-cream">{customer.transactionId}</span></p>}
                        {customer.notes && <p className="border-l-2 border-brand-gold/50 pl-3 text-sm italic text-brand-cream/70">{customer.notes}</p>}
                      </div>
                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-cream/55">Items</h3>
                        <div className="divide-y divide-white/10">
                          {items.map((item, index) => (
                            <div key={`${order.id}-${index}`} className="flex items-center gap-3 py-2.5">
                              <img src={item.product?.image || ''} alt="" className="h-10 w-10 shrink-0 object-cover" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-brand-cream">{item.product?.name || 'Item'}</p>
                                <p className="text-xs text-brand-cream/50">{item.weightOption?.weight || item.product?.quantityType || 'Unit'} × {Number(item.quantity) || 1}</p>
                                {Array.isArray(item.product?.comboProducts) && item.product.comboProducts.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {item.product.comboProducts.map((comboProduct) => (
                                      <span key={comboProduct.id} className="inline-flex items-center gap-1 rounded-full bg-white/5 pr-1.5 text-[10px] text-brand-gold/80">
                                        <img src={comboProduct.image} alt="" className="h-5 w-5 rounded-full object-cover" loading="lazy" />
                                        {comboProduct.productType || comboProduct.category || comboProduct.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="shrink-0 text-sm font-semibold text-brand-cream">{formatCurrency(getItemPrice(item) * (Number(item.quantity) || 1))}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-bold">
                          <span className="text-brand-cream/70">Order total</span>
                          <span className="text-brand-gold">{formatCurrency(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;