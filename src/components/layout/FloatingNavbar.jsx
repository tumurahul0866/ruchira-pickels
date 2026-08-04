import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Utensils, Tag, Info, Star, Mail, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Flavours', path: '/flavours', icon: Utensils },
  { name: 'Offers', path: '/offers', icon: Tag },
  { name: 'About Us', path: '/about', icon: Info },
  { name: 'Reviews', path: '/reviews', icon: Star },
  { name: 'Contact', path: '/contact', icon: Mail },
];

const FloatingNavbar = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 py-4 px-2 rounded-2xl floating-nav-panel"
      style={{ minWidth: 52 }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-1.5 rounded-full text-[#5C4033]/40 hover:text-[#D97706] hover:bg-[#D97706]/10 transition-all mb-1"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <AnimatePresence mode="wait">
          {collapsed
            ? <motion.div key="expand" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}><ChevronLeft size={14} /></motion.div>
            : <motion.div key="collapse" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}><ChevronRight size={14} /></motion.div>
          }
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.7 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.7 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-1.5 origin-top"
          >
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-[#8B1E1E] to-[#A52020] text-white shadow-lg scale-110'
                          : 'text-[#5C4033]/60 hover:bg-[#D97706]/12 hover:text-[#D97706] hover:scale-105'
                      }`
                    }
                    title={item.name}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                        {/* Tooltip */}
                        <span className="absolute right-14 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 delay-100 bg-[#5C4033] text-[#F8F3E8] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl">
                          {item.name}
                          <span className="absolute top-1/2 -translate-y-1/2 right-[-5px] w-0 h-0 border-y-4 border-y-transparent border-l-[5px] border-l-[#5C4033]" />
                        </span>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}

            {/* Divider */}
            <div className="w-7 h-px bg-gradient-to-r from-transparent via-[#5C4033]/20 to-transparent my-1" />

            {/* Cart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.06 }}
            >
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#8B1E1E] to-[#A52020] text-white shadow-lg scale-110'
                      : 'text-[#5C4033]/60 hover:bg-[#D97706]/12 hover:text-[#D97706] hover:scale-105'
                  }`
                }
                title="Cart"
              >
                <ShoppingCart size={20} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[#8B1E1E] text-white text-[9px] font-bold rounded-full h-4 w-4 grid place-items-center shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
                <span className="absolute right-14 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 delay-100 bg-[#5C4033] text-[#F8F3E8] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl">
                  Cart {cartCount > 0 ? `(${cartCount})` : ''}
                  <span className="absolute top-1/2 -translate-y-1/2 right-[-5px] w-0 h-0 border-y-4 border-y-transparent border-l-[5px] border-l-[#5C4033]" />
                </span>
              </NavLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* When collapsed — show only icons without labels */}
      {collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-1.5"
        >
          {[...navItems, { name: 'Cart', path: '/cart', icon: ShoppingCart }].map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-[#8B1E1E] text-white' : 'text-[#5C4033]/50 hover:text-[#D97706]'
                  }`
                }
              >
                <Icon size={16} />
              </NavLink>
            );
          })}
        </motion.div>
      )}
    </motion.aside>
  );
};

export default FloatingNavbar;
