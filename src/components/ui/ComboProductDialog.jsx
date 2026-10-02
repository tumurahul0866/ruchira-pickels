import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const ComboProductDialog = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [product, onClose]);

  if (!product) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="combo-product-dialog-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-slate-700 shadow hover:bg-white"
          aria-label="Close product details"
        >
          <X size={20} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full bg-amber-50 object-cover"
        />
        <div className="space-y-3 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Included in this combo</p>
          <h2 id="combo-product-dialog-title" className="text-2xl font-serif font-bold text-slate-900">
            {product.name}
          </h2>
          <p className="text-sm text-slate-600">
            {[product.productType, product.category].filter(Boolean).join(' · ')}
          </p>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-600">Product cost</span>
            <span className="text-xl font-bold text-slate-900">₹{product.price || 0}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
            <span className="text-sm font-medium text-amber-900">
              {product.unit === 'g' ? 'Included weight' : product.unit === 'ml' ? 'Included volume' : 'Included quantity'}
            </span>
            <span className="text-lg font-bold text-amber-950">
              {product.quantity || 1} {product.unit || 'units'}
            </span>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
};

export default ComboProductDialog;
