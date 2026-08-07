import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist, isProductInWishlist, getProductUnitPrice, getProductUnitLabel, isLegacyProduct, getProductVariants } from '../../services/dataStore';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const isLegacy = isLegacyProduct(product);
  const variantOptions = getProductVariants(product);
  const [selectedWeight, setSelectedWeight] = useState(() => variantOptions[0]);
  const [isWishlisted, setIsWishlisted] = useState(isProductInWishlist(user?.email, product.id));
  const [addedToast, setAddedToast] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedList = toggleWishlist(user?.email, product.id);
    setIsWishlisted(updatedList.includes(product.id));
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Always use the selected variant (label + price). Fallback to unit option.
    const option = selectedWeight ?? { label: getProductUnitLabel(product), price: getProductUnitPrice(product) };
    addToCart(product, option, 1);
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
      whileHover={{ y: -6 }}
      className="group rounded-[18px] overflow-hidden bg-white border border-[#5C4033]/10 shadow-md hover:shadow-xl hover:border-[#D97706]/40 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Product Image & Badges Container */}
        <div className="relative h-52 overflow-hidden bg-[#F8F3E8]">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1626002167669-0268a719f9bb?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                product.category === 'Veg'
                  ? 'bg-[#556B2F] text-white shadow-sm'
                  : 'bg-[#8B1E1E] text-white shadow-sm'
              }`}
            >
              {product.category === 'Veg' ? '🥬 Veg' : '🍖 Non-Veg'}
            </span>

            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-white/90 text-[#8B1E1E] border border-[#8B1E1E]/20 backdrop-blur-sm shadow-sm">
              {getSpiceEmojis(product.spiceLevel)}
            </span>
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm z-20 ${
              isWishlisted
                ? 'bg-[#8B1E1E] text-white'
                : 'bg-white/80 text-[#556B2F] hover:bg-white hover:text-[#8B1E1E]'
            }`}
            title="Save to Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
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
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#556B2F]">
              {product.productType}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-[#D97706] bg-[#F8F3E8] border border-[#D97706]/20 px-2 py-0.5 rounded-full">
              <Star size={12} fill="currentColor" />
              <span>{product.rating || 4.9}</span>
              <span className="text-[10px] text-[#5C4033]/60">({product.reviewsCount || 85})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-lg font-bold text-[#5C4033] leading-tight mb-2 group-hover:text-[#D97706] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#5C4033]/70 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>

          {/* Weight Option Selector */}
          <div className="mb-4">
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
          </div>
        </div>
      </div>

      {/* Footer Price & Add to Cart */}
      <div className="p-5 pt-0 border-t border-[#5C4033]/10 mt-2 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#5C4033]/60 block">Price</span>
          <p className="text-xl font-bold text-[#8B1E1E] font-sans">₹{selectedWeight.price}</p>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
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
    </motion.div>
  );
};

export default ProductCard;
