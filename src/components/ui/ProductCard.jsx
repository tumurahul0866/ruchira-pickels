import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import ComboProductDialog from './ComboProductDialog';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist, isProductInWishlist, getProductUnitPrice, getProductUnitLabel, isLegacyProduct, getProductVariants, getComboProductUnit } from '../../services/dataStore';

const ProductCard = ({ product, compact = false, catalogProducts = [] }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const wishlistKey = user?.email || user?.phone || user?.id;

  const isCombo = String(product.productType || '').trim().toLowerCase() === 'combos';
  const selectedComboIds = Array.isArray(product.comboProductIds) ? product.comboProductIds.map(String) : [];
  const comboProducts = Array.isArray(product.comboProducts) && product.comboProducts.length > 0
    ? product.comboProducts
    : catalogProducts
      .filter((item) => selectedComboIds.includes(String(item.id)))
      .map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image || '',
        productType: item.productType || 'Product',
        category: item.category || '',
        price: Number(item.pricePerUnit) || Number(item.weights?.[0]?.price) || 0,
        quantity: Number(product.comboProductQuantities?.[String(item.id)]) || 1,
        unit: getComboProductUnit(item),
      }));
  const isLegacy = isLegacyProduct(product);
  const variantOptions = getProductVariants(product);
  const [selectedWeight, setSelectedWeight] = useState(() => variantOptions[0]);
  const [isWishlisted, setIsWishlisted] = useState(isProductInWishlist(wishlistKey, product.id));
  const [addedToast, setAddedToast] = useState(false);
  const [selectedComboProduct, setSelectedComboProduct] = useState(null);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedList = toggleWishlist(wishlistKey, product.id);
    setIsWishlisted(updatedList.includes(product.id));
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Always use the selected variant (label + price). Fallback to unit option.
    const option = selectedWeight ?? { label: getProductUnitLabel(product), price: getProductUnitPrice(product) };
    const cartProduct = isCombo
      ? { ...product, comboProducts }
      : product;
    addToCart(cartProduct, option, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const getSpiceEmojis = (level) => {
    switch (level?.toLowerCase()) {
      case 'mild': return '🌶️ Mild';
      case 'medium': return '🌶️🌶️ Medium';
      case 'spicy':
      case 'hot': return '🌶️🌶️🌶️ Spicy';
      case 'extra hot': return '🌶️🌶️🌶️🌶️ Fire';
      default: return '🌶️ Medium';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden bg-white border border-[#5C4033]/10 shadow-md hover:shadow-lg hover:border-[#D97706]/40 transition-[box-shadow,border-color,transform] duration-300 ease-out flex flex-col justify-between rounded-none"
    >
      <div>
        {/* Product Image & Badges Container */}
        <div className={`relative overflow-hidden bg-[#F8F3E8] ${compact ? 'h-32 sm:h-36' : 'h-52'}`}>
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.03]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </Link>

          {/* Badges Overlay */}
          {!compact && <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                isCombo
                  ? 'bg-[#D97706] text-white shadow-sm'
                  : product.category === 'Veg'
                  ? 'bg-[#556B2F] text-white shadow-sm'
                  : 'bg-[#8B1E1E] text-white shadow-sm'
              }`}
            >
              {isCombo ? '🎁 Combo' : product.category === 'Veg' ? '🥬 Veg' : '🍖 Non-Veg'}
            </span>

            {!isCombo && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-white/90 text-[#8B1E1E] border border-[#8B1E1E]/20 backdrop-blur-sm shadow-sm">
                {getSpiceEmojis(product.spiceLevel)}
              </span>
            )}
          </div>}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute ${compact ? 'top-2 right-2 p-2' : 'top-3 right-3 p-2.5'} rounded-full backdrop-blur-md transition-all shadow-sm z-20 ${
              isWishlisted
                ? 'bg-[#8B1E1E] text-white'
                : 'bg-white/80 text-[#556B2F] hover:bg-white hover:text-[#8B1E1E]'
            }`}
            title="Save to Wishlist"
          >
            <Heart size={compact ? 14 : 16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 bg-[#5C4033]/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="text-[#F8F3E8] font-serif text-xs font-bold border border-[#F8F3E8]/40 px-4 py-1.5 rounded-full tracking-widest uppercase">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className={compact ? 'p-2.5 pb-2' : 'p-5'}>
          {!compact && <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#556B2F]">
              {product.productType}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-[#D97706] bg-[#F8F3E8] border border-[#D97706]/20 px-2 py-0.5 rounded-full">
              <Star size={12} fill="currentColor" />
              <span>{product.rating || 4.9}</span>
              <span className="text-[10px] text-[#5C4033]/60">({product.reviewsCount || 85})</span>
            </div>
          </div>}

          <Link to={`/product/${product.id}`}>
            <h3 className={`font-serif font-bold text-[#5C4033] leading-tight group-hover:text-[#D97706] transition-colors line-clamp-2 ${compact ? 'text-sm min-h-9' : 'text-lg mb-2 line-clamp-1'}`}>
              {product.name}
            </h3>
          </Link>
          {!compact && <p className="text-xs text-[#5C4033]/70 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>}
          {isCombo && (
            <p className={`text-[10px] font-semibold text-[#8B1E1E] ${compact ? 'mt-1' : '-mt-3 mb-3'}`}>
              {comboProducts.length > 0 || selectedComboIds.length > 0
                ? `Includes ${selectedComboIds.length || comboProducts.length} products`
                : 'Included products unavailable'}
            </p>
          )}
          {isCombo && comboProducts.length > 0 && (
            <div className={`flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${compact ? 'mt-1 pb-1' : '-mt-2 mb-3'}`} aria-label="Products included in combo">
              {comboProducts.map((comboProduct) => (
                <button
                  key={comboProduct.id}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedComboProduct(comboProduct);
                  }}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-[#5C4033]/10 bg-[#F8F3E8] pr-2 text-left hover:border-[#D97706] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
                  aria-label={`View ${comboProduct.name} included in this combo`}
                >
                  <img
                    src={comboProduct.image}
                    alt=""
                    className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} shrink-0 rounded-full object-cover`}
                    loading="lazy"
                  />
                  <span className={`${compact ? 'max-w-16 text-[8px]' : 'max-w-20 text-[9px]'} truncate font-semibold text-[#5C4033]/75`} title={comboProduct.productType || comboProduct.category || comboProduct.name}>
                    {comboProduct.productType || comboProduct.category || comboProduct.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Weight Option Selector */}
          {compact && variantOptions.length > 1 && (
            <div className="mb-2 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {variantOptions.map((variant, index) => {
                const selected = (selectedWeight.label ?? selectedWeight.weight) === (variant.label ?? variant.weight);
                return (
                  <button
                    key={`${variant.label}-${index}`}
                    type="button"
                    onClick={() => setSelectedWeight(variant)}
                    aria-pressed={selected}
                    className={`min-w-[36px] shrink-0 truncate rounded-md border px-1 py-1 text-[9px] font-bold ${
                      selected ? 'border-[#8B1E1E] bg-[#8B1E1E]/10 text-[#8B1E1E]' : 'border-[#5C4033]/15 text-[#5C4033]'
                    }`}
                  >
                    {variant.label}
                  </button>
                );
              })}
            </div>
          )}
          {!compact && <div className="mb-4">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-[#5C4033]/70 mb-1.5">
              {isLegacy ? `Select ${product.quantityType || 'Weight'}` : `Price per ${getProductUnitLabel(product)}`}:
            </label>
            <div className="flex gap-2">
              {variantOptions.map((v, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWeight(v);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    (selectedWeight.label ?? selectedWeight.weight) === (v.label ?? v.weight)
                      ? 'border-[#8B1E1E] bg-[#8B1E1E]/10 text-[#8B1E1E] shadow-sm'
                      : 'border-[#5C4033]/15 bg-[#F8F3E8]/50 text-[#5C4033] hover:border-[#D97706]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>}

        </div>
      </div>

      {/* Footer Price & Add to Cart */}
      <div className={`${compact ? 'px-2.5 pb-2.5 pt-0 flex-col items-stretch gap-2' : 'p-5 pt-0 border-t border-[#5C4033]/10 mt-2 items-center gap-3'} flex justify-between`}>
        {compact ? (
          <p className="text-xs font-semibold text-[#5C4033]/75">
            {selectedWeight.label ?? selectedWeight.weight} <span className="px-1">·</span>
            <span className="font-bold text-[#8B1E1E]">₹{selectedWeight.price}</span>
          </p>
        ) : (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#5C4033]/60 block">Price</span>
            <p className="text-xl font-bold text-[#8B1E1E] font-sans">₹{selectedWeight.price}</p>
          </div>
        )}

        <button
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className={`${compact ? 'w-full justify-center px-2 py-2' : 'px-4 py-2.5'} rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
            addedToast
              ? 'bg-[#556B2F] text-white'
              : product.inStock
              ? 'bg-[#8B1E1E] hover:bg-[#D97706] text-white'
              : 'bg-[#5C4033]/20 text-[#5C4033]/40 cursor-not-allowed'
          }`}
        >
          {addedToast ? (
            <>
              <Check size={16} /> Added!
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
      <ComboProductDialog product={selectedComboProduct} onClose={() => setSelectedComboProduct(null)} />
    </motion.div>
  );
};

export default ProductCard;
