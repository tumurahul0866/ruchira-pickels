import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  getProducts,
  getReviews,
  getStoreSettings,
  toggleWishlist,
  isProductInWishlist,
  getProductUnitPrice,
  getProductUnitLabel,
  isLegacyProduct
} from '../services/dataStore';
import {
  ArrowLeft,
  Heart,
  Star,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import Button from '../components/ui/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const storeSettings = getStoreSettings();

  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState({ weight: '250g', price: 0 });
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const allProducts = await getProducts();
      const found = allProducts.find((item) => item.id === id);
      setProduct(found);
      if (found) {
        const safeWeights = Array.isArray(found.weights) && found.weights.length > 0
          ? found.weights
          : [{ weight: getProductUnitLabel(found), price: getProductUnitPrice(found) }];
        setSelectedWeight(safeWeights[0]);
        setSelectedQuantity(1);
        setIsWishlisted(isProductInWishlist(user?.email, found.id));
      }
    };
    loadProduct();
  }, [id, user?.email]);
  const [addedToast, setAddedToast] = useState(false);

  const reviews = getReviews().filter(
    (review) => review.visible !== false && (!review.product || review.product === product?.name)
  );

  if (!product) {
    return (
      <div className="flex-grow bg-slate-50 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-xl">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Product Not Found</h1>
          <p className="text-slate-600 mb-6">The item you requested could not be located in our catalog.</p>
          <Button variant="primary" onClick={() => navigate('/flavours')} className="px-8 py-3">
            Explore All Flavours
          </Button>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    const list = toggleWishlist(user?.email, product.id);
    setIsWishlisted(list.includes(product.id));
  };

  const handleAddToCart = () => {
    const option = isLegacyProduct(product)
      ? selectedWeight
      : { weight: getProductUnitLabel(product), price: getProductUnitPrice(product) };
    const quantity = isLegacyProduct(product) ? 1 : selectedQuantity;
    addToCart(product, option, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    const option = isLegacyProduct(product)
      ? selectedWeight
      : { weight: getProductUnitLabel(product), price: getProductUnitPrice(product) };
    const quantity = isLegacyProduct(product) ? 1 : selectedQuantity;
    addToCart(product, option, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const quantityType = product.quantityType || 'Weight';
    const isLegacy = isLegacyProduct(product);
    const quantityLabel = isLegacy ? selectedWeight.weight : `${selectedQuantity} ${quantityType}`;
    const unitPrice = isLegacy ? selectedWeight.price : getProductUnitPrice(product);
    const text = `Hi Vasuki Pickles! I would like to order *${product.name}* (${quantityType}: ${quantityLabel} for ₹${unitPrice}${isLegacy ? '' : ` each`}).`;
    const encoded = encodeURIComponent(text);
    const phone = storeSettings.whatsappNumber || '918885473903';
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex-grow bg-gradient-to-b from-brand-cream/30 via-white to-brand-cream/20 min-h-screen text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-gold mb-6 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={18} /> Back to Catalog
        </button>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Image & Primary Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Product Image */}
              <div className="md:col-span-6 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                    isWishlisted
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
                  }`}
                  title="Toggle Wishlist"
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Specs & Buy Controls */}
              <div className="md:col-span-6 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      product.category === 'Veg'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {product.category === 'Veg' ? '🥬 100% Vegetarian' : '🍖 Non-Vegetarian'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    🌶️ {product.spiceLevel}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-xs font-bold text-amber-500">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span>{product.rating || 4.9}</span>
                    <span className="text-slate-400">({product.reviewsCount || 85} Reviews)</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.description}</p>

                {isLegacyProduct(product) ? (
                  <div className="pt-3 border-t border-slate-100">
                    <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
                      Select {product.quantityType || 'Weight'}:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {product.weights.map((w, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedWeight(w)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                            selectedWeight.weight === w.weight
                              ? 'border-brand-gold bg-brand-gold/15 text-brand-black shadow-sm'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div>{w.weight}</div>
                          <div className="text-[11px] text-slate-500">₹{w.price}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total:</span>
                      <span className="text-3xl font-bold font-mono text-slate-900">₹{selectedWeight.price}</span>
                      <span className="text-xs text-slate-500 font-medium">({product.quantityType || 'Weight'}: {selectedWeight.weight})</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-100">
                    <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
                      Quantity ({product.quantityType || 'Unit'})
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                        className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(Math.max(1, Number(e.target.value) || 1))}
                        className="w-20 text-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                        className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 pt-4">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total:</span>
                      <span className="text-3xl font-bold font-mono text-slate-900">₹{getProductUnitPrice(product) * selectedQuantity}</span>
                      <span className="text-xs text-slate-500 font-medium">({product.quantityType || 'Unit'} @ ₹{getProductUnitPrice(product)} each)</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className={`py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        addedToast
                          ? 'bg-emerald-600 text-white'
                          : product.inStock
                          ? 'bg-brand-gold hover:bg-brand-gold-light text-brand-black shadow-md'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {addedToast ? <Check size={16} /> : <ShoppingCart size={16} />}
                      {addedToast ? 'Added to Cart!' : 'Add to Cart'}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={!product.inStock}
                      className="py-3.5 px-4 rounded-2xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                    >
                      Buy Now
                    </button>
                  </div>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare size={16} /> Instant Order via WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients & Shelf Life Details */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1 text-xs uppercase tracking-wider">
                  🌿 Ingredients Used
                </span>
                <p className="text-slate-600 leading-relaxed">{product.ingredients}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1 text-xs uppercase tracking-wider">
                  ⏳ Shelf Life & Storage
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {product.shelfLife}. Store in a clean dry glass jar. Use a dry spoon for optimal freshness.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar: Trust Badges & Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Guarantee Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-brand-gold" /> Why Vasuki Pickles?
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>100% Traditional wood-pressed groundnut oil used.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Handcrafted in small hygienic batches.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Truck size={16} className="text-brand-gold shrink-0" />
                  <span>Free shipping on all orders above ₹999.</span>
                </li>
              </ul>
            </div>

            {/* Customer Reviews for this item */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif font-bold text-slate-900">Customer Feedback</h3>
                <Link to="/reviews" className="text-xs font-bold text-brand-gold hover:underline">
                  View All
                </Link>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500">No specific reviews yet. Be the first to try!</p>
              ) : (
                <div className="space-y-3">
                  {reviews.slice(0, 2).map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
