import { useState, useEffect } from 'react';
import { getStoreSettings, saveStoreSettings, getProducts, saveProduct } from '../../services/dataStore';
import { Image, Upload, Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ChangePictures = () => {
  const [storeSettings, setStoreSettings] = useState(() => getStoreSettings());
  const [products, setProducts] = useState([]);
  const [changedProductIds, setChangedProductIds] = useState(() => new Set());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setProducts(await getProducts());
    };
    loadData();
  }, []);

  const handleStoreImageChange = (key, value) => {
    setStoreSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveStoreImage = (key) => {
    setStoreSettings((prev) => ({ ...prev, [key]: '' }));
  };

  const handleProductImageChange = (id, value) => {
    const updatedProducts = products.map((p) =>
      p.id === id ? { ...p, image: value } : p
    );
    setProducts(updatedProducts);
    setChangedProductIds((previous) => new Set(previous).add(id));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    await saveStoreSettings(storeSettings);
    await Promise.all(products.filter((product) => changedProductIds.has(product.id)).map((product) => saveProduct(product)));
    setChangedProductIds(new Set());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-cream flex items-center gap-2">
            <Image className="text-brand-gold" size={28} /> Website Pictures & Media Manager
          </h1>
          <p className="text-xs sm:text-sm text-brand-cream/60 mt-1">
            Change, update, or remove images for the Home Page, About Us Page, and Product Catalog.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
        >
          {savedSuccess ? <Check size={18} /> : <Upload size={18} />}
          {savedSuccess ? 'All Pictures Saved!' : 'Save All Image Updates'}
        </motion.button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-sm font-semibold flex items-center gap-2 shadow-md">
          <Check size={18} /> All Home page, About Us page, and Product image changes have been saved to live site!
        </div>
      )}

      {/* Home Page & About Us Page Images Section */}
      <div className="p-6 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-6 shadow-xl">
        <h2 className="text-xl font-serif font-bold text-brand-gold border-b border-white/10 pb-3">
          🖼️ Home Page & About Us Page Main Pictures
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Home Page Hero Background Image */}
          <div className="space-y-3 bg-brand-black p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-gold">
                Home Hero Background
              </label>
              {storeSettings.heroBackgroundUrl && (
                <button
                  onClick={() => handleRemoveStoreImage('heroBackgroundUrl')}
                  className="text-rose-400 hover:underline text-xs flex items-center gap-1 font-bold"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>

            <input
              type="url"
              value={storeSettings.heroBackgroundUrl || ''}
              onChange={(e) => handleStoreImageChange('heroBackgroundUrl', e.target.value)}
              placeholder="Image URL https://..."
              className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono font-semibold"
            />

            <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
              {storeSettings.heroBackgroundUrl ? (
                <img
                  src={storeSettings.heroBackgroundUrl}
                  alt="Home Hero Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-brand-cream/40 italic">No image (Removed)</span>
              )}
            </div>
          </div>

          {/* 2. Home Page Feature / Bestseller Image */}
          <div className="space-y-3 bg-brand-black p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-gold">
                Home Feature Highlight Image
              </label>
              {storeSettings.featureImageUrl && (
                <button
                  onClick={() => handleRemoveStoreImage('featureImageUrl')}
                  className="text-rose-400 hover:underline text-xs flex items-center gap-1 font-bold"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>

            <input
              type="url"
              value={storeSettings.featureImageUrl || ''}
              onChange={(e) => handleStoreImageChange('featureImageUrl', e.target.value)}
              placeholder="Image URL https://..."
              className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono font-semibold"
            />

            <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
              {storeSettings.featureImageUrl ? (
                <img
                  src={storeSettings.featureImageUrl}
                  alt="Home Feature Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-brand-cream/40 italic">No image (Removed)</span>
              )}
            </div>
          </div>

          {/* 3. About Us Page Story Image */}
          <div className="space-y-3 bg-brand-black p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-gold">
                About Us Heritage Story Picture
              </label>
              {storeSettings.aboutImageUrl && (
                <button
                  onClick={() => handleRemoveStoreImage('aboutImageUrl')}
                  className="text-rose-400 hover:underline text-xs flex items-center gap-1 font-bold"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>

            <input
              type="url"
              value={storeSettings.aboutImageUrl || ''}
              onChange={(e) => handleStoreImageChange('aboutImageUrl', e.target.value)}
              placeholder="Image URL https://..."
              className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono font-semibold"
            />

            <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
              {storeSettings.aboutImageUrl ? (
                <img
                  src={storeSettings.aboutImageUrl}
                  alt="About Us Story Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-brand-cream/40 italic">No image (Removed)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Image Catalog Manager */}
      <div className="p-6 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-6 shadow-xl">
        <h2 className="text-xl font-serif font-bold text-brand-gold border-b border-white/10 pb-3">
          🌶️ Product Catalog Image URLs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-brand-black border border-white/10 space-y-3"
            >
              <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-brand-cream/40 italic">
                    No image set
                  </div>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-brand-black/80 text-[#FFD700] text-[10px] font-bold">
                  {product.productType || 'Pickle'}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-brand-cream text-sm truncate">{product.name}</h3>
                <p className="text-[11px] text-brand-cream/60">ID: #{product.id}</p>
              </div>

              <input
                type="url"
                value={product.image || ''}
                onChange={(e) => handleProductImageChange(product.id, e.target.value)}
                placeholder="Image URL https://..."
                className="w-full bg-white border-2 border-brand-gold/30 rounded-xl px-3 py-2 text-[11px] text-gray-900 font-mono font-semibold focus:outline-none focus:border-brand-gold"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangePictures;