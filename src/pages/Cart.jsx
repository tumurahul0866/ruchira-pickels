import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getOffers } from '../services/dataStore';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [promoError, setPromoError] = useState('');

  const subtotal = getCartTotal();
  const discountPercent = appliedOffer ? appliedOffer.discount : 0;
  const discountAmount = appliedOffer ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const isFreeShipping = subtotal >= 999;
  const shippingCost = isFreeShipping ? 0 : 80;
  const finalTotal = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const activeOffers = getOffers().filter((o) => o.active);
    const matched = activeOffers.find(
      (o) => o.code && o.code.toUpperCase() === promoCode.trim().toUpperCase()
    );
    if (matched) {
      if (matched.minOrderValue && subtotal < matched.minOrderValue) {
        setPromoError(`Minimum order of ₹${matched.minOrderValue} required for this coupon.`);
        setAppliedOffer(null);
      } else {
        setAppliedOffer(matched);
        setPromoError('');
      }
    } else {
      setAppliedOffer(null);
      setPromoError('Invalid coupon code. Please check active offers on the Offers page.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 bg-[#F8F3E8] min-h-[65vh] text-[#5C4033]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md space-y-4"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border border-[#5C4033]/15">
            <ShoppingBag size={42} className="text-[#8B1E1E]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#5C4033]">Your Cart is Empty</h2>
          <p className="text-sm text-[#5C4033]/70">Looks like you haven't added any of our delicious pickles or podis yet.</p>
          <Link to="/flavours">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              className="mt-2 px-8 py-3.5 rounded-full bg-[#8B1E1E] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#D97706] transition-all"
            >
              Explore All Flavours
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#F8F3E8] text-[#5C4033] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#5C4033] mb-8">
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-grow space-y-4">
            {cartItems.map((item) => (
              <motion.div 
                key={item.itemKey}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-5 rounded-[22px] border-2 border-[#5C4033]/12 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover rounded-2xl border border-[#5C4033]/10 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#556B2F]/10 text-[#556B2F] text-[10px] font-bold uppercase">
                      {item.product.productType || 'Pickle'}
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#5C4033] mt-0.5">{item.product.name}</h3>
                    <>
                      <p className="text-xs text-[#5C4033]/65 font-medium">
                        Pack: {item.weightOption?.label ?? item.weightOption?.weight}
                      </p>
                      <p className="text-xs font-bold text-[#8B1E1E] mt-1">Unit Price: ₹{item.weightOption.price}</p>
                    </>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#5C4033]/10">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-[#F8F3E8] border border-[#5C4033]/20 rounded-xl p-1">
                    <motion.button 
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
                      className="p-1.5 rounded-lg text-[#5C4033] hover:bg-white transition-colors"
                      title="Decrease"
                    >
                      <Minus size={14} />
                    </motion.button>
                    <span className="w-7 text-center text-xs font-bold text-[#5C4033]">{item.quantity}</span>
                    <motion.button 
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
                      className="p-1.5 rounded-lg text-[#5C4033] hover:bg-white transition-colors"
                      title="Increase"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#5C4033]">₹{item.weightOption.price * item.quantity}</p>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.itemKey)}
                      className="text-xs text-[#8B1E1E] hover:underline font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <Trash2 size={13} /> Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary & Checkout Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-[28px] border-2 border-[#5C4033]/15 shadow-md sticky top-28 space-y-5">
              <h2 className="text-xl font-serif font-bold text-[#5C4033] border-b border-[#5C4033]/10 pb-3">
                Order Summary
              </h2>

              {/* Promo Code Input Text Box */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033]">
                  Have a Coupon Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. KONASEMA10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-white border-2 border-[#5C4033]/20 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#5C4033] focus:outline-none focus:border-[#D97706] uppercase placeholder-[#5C4033]/40 shadow-inner"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#D97706] transition-colors shadow-md"
                  >
                    Apply
                  </motion.button>
                </div>
                {appliedOffer && (
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                    <Check size={14} className="text-emerald-600" /> Coupon <strong>{appliedOffer.code}</strong> Applied! {appliedOffer.discount}% discount saved — ₹{discountAmount} off!
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">{promoError}</p>
                )}
              </form>

              <div className="space-y-2.5 text-xs text-[#5C4033]/80 border-t border-[#5C4033]/10 pt-4">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#5C4033]">₹{subtotal}</span>
                </div>

                {appliedOffer && (
                  <div className="flex justify-between text-emerald-700 font-extrabold">
                    <span>Coupon Discount ({appliedOffer.discount}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  {isFreeShipping ? (
                    <span className="font-bold text-[#556B2F]">FREE (Orders &gt; ₹999)</span>
                  ) : (
                    <span className="font-semibold text-[#5C4033]">₹{shippingCost}</span>
                  )}
                </div>

                {!isFreeShipping && (
                  <p className="text-[11px] text-[#D97706] font-semibold bg-[#D97706]/10 p-2 rounded-xl">
                    💡 Add ₹{999 - subtotal} more to get 100% FREE Shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-[#5C4033]/15 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-serif font-bold text-[#5C4033]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#8B1E1E]">₹{finalTotal}</span>
                </div>
                <p className="text-[11px] text-[#5C4033]/50 text-right mt-0.5">Inclusive of all local taxes</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-full bg-[#8B1E1E] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
