import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Shield, Menu, X, LogOut, Search, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getWishlist, getOffers } from '../../services/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const { cartItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = getWishlist(user?.email).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const activeOffers = getOffers().filter((o) => o.active);
    if (activeOffers.length > 0) {
      setActiveOffer(activeOffers[0]);
    } else {
      setActiveOffer(null);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/flavours?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Announcement Bar — Render ONLY if active offer exists in Admin Portal */}
      {activeOffer && (
        <div className="bg-[#8B1E1E] text-[#F8F3E8] text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
          <Sparkles size={14} className="text-[#FFD700] animate-pulse shrink-0" />
          <span>
            🎉 {activeOffer.title}: {activeOffer.description} | Code: <strong className="text-[#FFD700] font-mono bg-white/15 px-2 py-0.5 rounded-md border border-[#FFD700]/30">{activeOffer.code}</strong>
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-[#F8F3E8]/95 backdrop-blur-xl shadow-md border-b border-[#5C4033]/10'
            : 'bg-[#F8F3E8]/85 backdrop-blur-lg border-b border-[#5C4033]/08'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-3">

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#5C4033] flex items-center justify-center text-[#F8F3E8] font-serif font-bold text-xl shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 border border-[#D97706]/30">
                K
              </div>
              <div className="flex flex-col">
                <span className="text-base font-serif font-bold tracking-wider text-[#5C4033] group-hover:text-[#8B1E1E] transition-colors leading-tight">
                  KONASEMA RUCHULU
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#556B2F] leading-tight">
                  Heritage Delta Pickles
                </span>
              </div>
            </Link>

            {/* Middle — Search Bar */}
            <div className="flex-1 max-w-md mx-6 hidden sm:block">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#556B2F]" />
                <input
                  type="text"
                  placeholder="Search pickles, podis, sweets, snacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/95 border border-[#5C4033]/20 focus:outline-none focus:border-[#D97706] focus:bg-white transition-all text-xs font-semibold text-[#5C4033] placeholder-[#5C4033]/45 shadow-inner"
                />
              </div>
            </div>

            {/* Right Side Actions — Cart, Wishlist, User Login & Admin Login */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* Wishlist */}
              {!isAdmin && (
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="relative p-2.5 rounded-xl text-[#556B2F] hover:text-[#8B1E1E] hover:bg-[#8B1E1E]/08 transition-all"
                  title="Wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#8B1E1E] text-white text-[9px] font-bold rounded-full h-4 w-4 grid place-items-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Button */}
              {!isAdmin && (
                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B1E1E] text-white font-bold hover:bg-[#A52020] transition-all duration-300 shadow-md hover:shadow-lg text-xs tracking-wide"
                >
                  <ShoppingCart size={17} className="text-[#FFD700]" />
                  <span className="text-white font-bold">Cart</span>
                  {cartCount > 0 ? (
                    <span className="bg-[#FFD700] text-[#8B1E1E] text-[10px] font-extrabold rounded-full h-4.5 w-4.5 grid place-items-center shadow-sm">
                      {cartCount}
                    </span>
                  ) : (
                    <span className="text-[#FFD700] font-bold text-xs">(0)</span>
                  )}
                </Link>
              )}

              {/* User Login & Admin Login Buttons */}
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <Link to="/admin" className="px-3.5 py-1.5 rounded-full bg-[#556B2F] text-white text-xs font-bold hover:bg-[#6B8E23] transition-colors shadow-sm flex items-center gap-1.5">
                    <Shield size={14} className="text-[#FFD700]" />
                    Admin Panel
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-[#556B2F] hover:text-[#8B1E1E] transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#5C4033]/15 hover:border-[#D97706]/50 text-[#5C4033] text-xs font-semibold transition-all shadow-sm"
                  >
                    <User size={16} className="text-[#556B2F]" />
                    <span className="max-w-[70px] truncate">{user.name?.split(' ')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-[#556B2F] hover:text-[#8B1E1E] transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full border-2 border-[#8B1E1E] text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-white transition-all text-xs font-bold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/admin-login"
                    className="px-3.5 py-2 rounded-full bg-[#5C4033] text-[#F8F3E8] hover:bg-[#8B1E1E] transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Shield size={13} className="text-[#FFD700]" />
                    Admin Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile right side */}
            <div className="flex items-center gap-2 md:hidden">
              <Link to="/cart" className="relative p-2.5 rounded-full bg-[#8B1E1E] text-white flex items-center gap-1">
                <ShoppingCart size={18} className="text-[#FFD700]" />
                <span className="text-white text-xs font-bold">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-[#FFD700] text-[#8B1E1E] text-[9px] font-extrabold rounded-full h-4 w-4 grid place-items-center ml-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[#5C4033] rounded-lg hover:bg-[#5C4033]/08 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={24} /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={24} /></motion.div>
                  }
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-[#F8F3E8]/98 backdrop-blur-xl border-t border-[#5C4033]/10 px-4 pt-4 pb-6 space-y-3"
            >
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#556B2F]" />
                <input
                  type="text"
                  placeholder="Search pickles, podis, sweets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#5C4033]/15 text-sm text-[#5C4033] focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="pt-2 border-t border-[#5C4033]/10 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl bg-white border border-[#5C4033]/15 text-[#5C4033] font-semibold text-sm shadow-sm"
                    >
                      My Dashboard & Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center py-2.5 rounded-xl bg-[#556B2F] text-white font-semibold text-sm flex items-center justify-center gap-1.5"
                      >
                        <Shield size={16} className="text-[#FFD700]" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full text-center py-2.5 rounded-xl bg-[#8B1E1E]/08 text-[#8B1E1E] font-semibold text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 rounded-xl border-2 border-[#8B1E1E] text-[#8B1E1E] font-bold text-xs"
                    >
                      User Login
                    </Link>

                    <Link
                      to="/admin-login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 rounded-xl bg-[#5C4033] text-[#F8F3E8] font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Shield size={13} className="text-[#FFD700]" /> Admin Login
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
