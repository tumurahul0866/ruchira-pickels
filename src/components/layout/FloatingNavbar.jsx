import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Tag, Heart, MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getWishlist } from '../../services/dataStore';

const FloatingNavbar = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { user } = useAuth();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = getWishlist(user?.email || user?.phone || user?.id).length;

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      isActive: location.pathname === '/',
    },
    {
      name: 'Offers',
      path: '/offers',
      icon: Tag,
      isActive: location.pathname === '/offers',
    },
    {
      name: 'Wishlist',
      path: user ? '/dashboard' : '/login',
      state: user ? { tab: 'wishlist' } : undefined,
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null,
      isActive:
        location.pathname === '/wishlist' ||
        (location.pathname === '/dashboard' &&
          (location.state?.tab === 'wishlist' || location.search.includes('tab=wishlist'))),
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
      isActive: location.pathname === '/messages' || location.pathname === '/reviews',
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount : null,
      isActive: location.pathname === '/cart' || location.pathname === '/checkout',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 w-full bg-[#F8F3E8]/96 backdrop-blur-xl border-t border-[#5C4033]/15 shadow-[0_-4px_25px_rgba(92,64,51,0.08)] select-none">
      <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-8">
        <div className="grid grid-cols-5 h-[68px] sm:h-[76px] items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                state={item.state}
                className="relative flex flex-col items-center justify-center h-full py-1 group transition-all"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="flex flex-col items-center justify-center gap-1 w-full"
                >
                  <div className="relative flex items-center justify-center">
                    <Icon
                      className={`transition-all duration-200 ${
                        active
                          ? 'text-[#8B1E1E] scale-110'
                          : 'text-[#5C4033]/70 group-hover:text-[#8B1E1E] group-hover:scale-105'
                      }`}
                      size={22}
                      strokeWidth={active ? 2.4 : 1.8}
                    />

                    {item.badge !== null && item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2.5 bg-[#8B1E1E] text-white text-[9px] sm:text-[10px] font-extrabold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm border border-[#F8F3E8] leading-none">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] sm:text-[12px] tracking-tight text-center truncate max-w-full leading-none transition-colors duration-200 ${
                      active ? 'text-[#8B1E1E] font-bold' : 'text-[#5C4033]/70 group-hover:text-[#8B1E1E]'
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>

                {active && (
                  <motion.div
                    layoutId="bottomNavActiveIndicator"
                    className="absolute bottom-0 w-8 sm:w-10 h-1 bg-[#8B1E1E] rounded-t-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default FloatingNavbar;
