import { useState, useEffect } from 'react';
import { getOffers, saveOffer, deleteOffer, toggleOffer, getProducts } from '../../services/dataStore';
import { resolveApiUrl } from '../../services/apiConfig';
import { Trash2, Check, Edit2, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

const OFFERS_API = resolveApiUrl('/offers');

const ApplyOffers = () => {
  // Start empty; populated by backend fetch on mount
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(999);
  const [active, setActive] = useState(true);
  const [productId, setProductId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch latest offers from backend on every mount
  const fetchOffersFromBackend = async () => {
    try {
      const res = await fetch(OFFERS_API);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOffers(data);
          return;
        }
      }
    } catch {
      // Fall through to local cache
    }
    // Fallback to locally cached offers
    setOffers(getOffers());
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchOffersFromBackend(),
        getProducts().then(setProducts),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const resetForm = () => {
    setEditingOffer(null);
    setCode('');
    setTitle('');
    setDescription('');
    setDiscount(10);
    setMinOrderValue(999);
    setActive(true);
    setProductId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveOffer({
      id: editingOffer ? editingOffer.id : undefined,
      code: (code.trim() || 'KONASEMA10').toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      discount: Number(discount),
      minOrderValue: Number(minOrderValue) || 0,
      active,
      productId
    });

    await fetchOffersFromBackend();
    setSuccessMsg(editingOffer ? 'Coupon offer updated!' : 'New coupon offer added & published!');
    setTimeout(() => setSuccessMsg(''), 3000);
    resetForm();
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setCode(offer.code || '');
    setTitle(offer.title || '');
    setDescription(offer.description || '');
    setDiscount(offer.discount || 10);
    setMinOrderValue(offer.minOrderValue || 0);
    setActive(offer.active !== undefined ? offer.active : true);
    setProductId(offer.productId || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon offer?')) {
      // Optimistically remove
      setOffers((prev) => prev.filter((o) => o.id !== id));
      try {
        await deleteOffer(id);
        // Confirm with backend state
        await fetchOffersFromBackend();
        if (editingOffer && editingOffer.id === id) resetForm();
      } catch (error) {
        await fetchOffersFromBackend();
        alert('Failed to delete offer: ' + (error?.message || 'Server error.'));
      }
    }
  };

  const handleToggle = async (id) => {
    // Optimistically update local state
    setOffers((prev) =>
      prev.map((o) => o.id === id ? { ...o, active: !o.active } : o)
    );
    try {
      await toggleOffer(id);
      // Re-fetch from backend to confirm persisted state
      await fetchOffersFromBackend();
    } catch (error) {
      // Revert optimistic update on error
      await fetchOffersFromBackend();
      alert('Failed to update offer status: ' + (error?.message || 'Server error.'));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-serif font-bold text-brand-cream flex items-center gap-2">
          <Ticket size={28} className="text-brand-gold" /> Custom Coupon & Offer Manager
        </h1>
        <p className="text-xs text-brand-cream/60 mt-1">
          Create, edit, activate, or remove promo coupon codes (e.g. KONASEMA10) and discount rules. Active coupons automatically appear on the website and work dynamically at Checkout.
        </p>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-sm font-semibold flex items-center gap-2 shadow-md"
        >
          <Check size={18} /> {successMsg}
        </motion.div>
      )}

      {/* Add / Edit Coupon Offer Form */}
      <div className="p-6 md:p-8 rounded-3xl bg-brand-matte border border-brand-gold/30 shadow-2xl space-y-6">
        <h2 className="text-xl font-serif font-bold text-brand-gold border-b border-white/10 pb-3 flex items-center gap-2">
          {editingOffer ? '✏️ Edit Coupon Offer' : '➕ Create New Coupon Code'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-gold mb-1.5">
                Coupon Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. KONASEMA10"
                required
                className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-brand-gold uppercase"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream/80 mb-1.5">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="0"
                max="100"
                required
                className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream/80 mb-1.5">
                Minimum Order Amount (₹)
              </label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                min="0"
                placeholder="999"
                className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream/80 mb-1.5">
                Offer Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grand Konasema Festive Sale"
                required
                className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream/80 mb-1.5">
                Target Product (Optional)
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-gold"
              >
                <option value="">🎁 Store-Wide (All Products)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    🌶️ {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream/80 mb-1.5">
                Offer Description / Terms
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="e.g. Enjoy 10% OFF on all orders above ₹999 + FREE Express Shipping across India!"
                className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <label className="flex items-center gap-2.5 text-xs font-extrabold text-brand-gold cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4.5 w-4.5 rounded accent-brand-gold cursor-pointer"
              />
              Active Coupon (Displayed on Top Banner & Active Offers Page)
            </label>

            <div className="flex gap-3">
              {editingOffer && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-brand-cream text-xs font-bold"
                >
                  Cancel
                </button>
              )}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-gold-light transition-all shadow-lg"
              >
                {editingOffer ? 'Update Coupon' : 'Save & Publish Coupon'}
              </motion.button>
            </div>
          </div>
        </form>
      </div>

      {/* Active Coupons List Table */}
      <div className="p-6 rounded-3xl bg-brand-matte border border-white/10 space-y-4">
        <h2 className="text-xl font-serif font-bold text-brand-gold border-b border-white/10 pb-3">
          📋 Manage Coupons & Offers ({offers.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                offer.active
                  ? 'bg-brand-black border-brand-gold/40 shadow-md'
                  : 'bg-brand-black/50 border-white/08 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-brand-gold text-brand-black text-xs font-mono font-extrabold">
                    CODE: {offer.code || 'KONASEMA10'}
                  </span>
                  <button
                    onClick={() => handleToggle(offer.id)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                      offer.active
                        ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/15'
                        : 'border-slate-500 text-slate-400'
                    }`}
                  >
                    {offer.active ? '✓ Active' : '✕ Disabled'}
                  </button>
                </div>

                <h3 className="font-serif font-bold text-brand-cream text-base mt-2">{offer.title}</h3>
                <p className="text-xs text-brand-cream/75 leading-relaxed">{offer.description}</p>
                
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-brand-gold/80 pt-1">
                  <span>Discount: {offer.discount}%</span>
                  <span>•</span>
                  <span>Min Order: ₹{offer.minOrderValue || 0}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleEdit(offer)}
                  className="text-xs text-brand-gold hover:underline font-bold flex items-center gap-1"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="text-xs text-brand-red hover:underline font-bold flex items-center gap-1"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplyOffers;