import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOffers, getProducts } from '../services/dataStore';
import ProductCard from '../components/ui/ProductCard';
import { Tag, Sparkles, Gift, Check, Copy, Flame } from 'lucide-react';

const gradients = [
  'from-[#8B1E1E] to-[#5C4033] border-[#D97706]/40',
  'from-[#556B2F] to-[#3B4E1F] border-[#556B2F]/40',
  'from-[#5C4033] to-[#3B2A20] border-[#D97706]/40',
  'from-[#1E3A5F] to-[#0D2340] border-blue-500/30',
  'from-[#6B2C4B] to-[#3D1829] border-pink-500/30',
];

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const activeOffers = getOffers().filter((o) => o.active);
      const visibleProducts = (await getProducts()).filter((p) => p.visible);
      setOffers(activeOffers);
      setProducts(visibleProducts);
    };
    loadData();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  // Only show products linked to active offers
  const discountedProducts = products.filter(
    (p) => p.discountPrice > 0 || offers.some((o) => o.productId === p.id)
  );

  return (
    <div className="flex-grow bg-[#F8F3E8] min-h-screen py-12 text-[#5C4033]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#8B1E1E]/10 text-[#8B1E1E] text-xs uppercase font-extrabold tracking-widest border border-[#8B1E1E]/20 shadow-sm">
            <Sparkles size={14} className="text-[#D97706] animate-pulse" /> Exclusive Deals & Discounts
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#5C4033]">
            Active Offers & Coupons
          </h1>
          <p className="text-sm sm:text-base text-[#5C4033]/80">
            All active coupon codes managed by us. Use them at checkout to reduce your order price instantly.
          </p>
        </motion.div>

        {/* Active Offers from Admin Portal */}
        {offers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-3xl bg-white border-2 border-[#5C4033]/15 space-y-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-[#D97706]/10 flex items-center justify-center border border-[#D97706]/20">
              <Tag size={36} className="text-[#D97706]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#5C4033]">No Active Offers Right Now</h2>
            <p className="text-sm text-[#5C4033]/70 max-w-sm mx-auto">
              Check back soon! Our team regularly adds exclusive coupon codes and seasonal discounts.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const grad = gradients[index % gradients.length];
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`rounded-[28px] bg-gradient-to-br ${grad} p-7 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border-2`}
                >
                  {/* Background decorative circle */}
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-[10px] uppercase font-extrabold tracking-widest inline-flex items-center gap-1.5 backdrop-blur-sm">
                        <Flame size={12} className="text-[#FFD700]" />
                        {offer.discount > 0 ? `${offer.discount}% OFF` : 'Special Promo'}
                      </span>
                      {offer.minOrderValue > 0 && (
                        <span className="text-[10px] font-bold bg-white/15 px-2 py-1 rounded-lg">
                          Min ₹{offer.minOrderValue}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-white leading-tight">{offer.title}</h3>
                    <p className="text-xs text-white/85 leading-relaxed">{offer.description}</p>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-white/20 mt-5 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Code:</span>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30 font-mono font-extrabold text-sm text-[#FFD700] tracking-wider">
                        {offer.code || 'SPECIAL'}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleCopyCode(offer.code)}
                      className="px-4 py-2 rounded-full bg-[#FFD700] hover:bg-white text-[#8B1E1E] text-xs font-extrabold transition-all shadow-lg flex items-center gap-1.5"
                    >
                      <AnimatePresence mode="wait">
                        {copiedCode === offer.code ? (
                          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                            <Check size={13} /> Copied!
                          </motion.span>
                        ) : (
                          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                            <Copy size={13} /> Copy Code
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Always-Visible Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border-2 border-[#D97706]/30 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-md"
        >
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#D97706]/10 flex items-center justify-center border border-[#D97706]/20">
            <Gift size={26} className="text-[#D97706]" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#5C4033] mb-1">FREE Express Shipping</h3>
            <p className="text-xs text-[#5C4033]/75 leading-relaxed">
              All orders above ₹999 automatically qualify for 100% FREE doorstep delivery anywhere in India. No coupon needed!
            </p>
          </div>
        </motion.div>

        {/* Discounted Products Showcase */}
        {discountedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="border-b border-[#5C4033]/15 pb-4">
              <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#D97706] block mb-1">
                Limited Time Deals
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5C4033]">
                Offer-Linked Products
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} offer={offers[0]} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Offers;
