import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getWishlist, getStoreSettings, refreshStoreSettings } from '../../services/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [storeSettings, setStoreSettings] = useState(() => getStoreSettings());
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const wishlistCount = getWishlist(user?.email || user?.phone || user?.id).length;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const handleStoreSettingsUpdated = (event) => {
      setStoreSettings(event.detail);
    };
    window.addEventListener('vasuki:store-settings-updated', handleStoreSettingsUpdated);
    refreshStoreSettings()
      .then((settings) => {
        if (isMounted) setStoreSettings(settings);
      })
      .catch(() => {
        if (isMounted) setStoreSettings(getStoreSettings());
      });
    return () => {
      isMounted = false;
      window.removeEventListener('vasuki:store-settings-updated', handleStoreSettingsUpdated);
    };
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (location.pathname === '/') {
      const nextParams = new URLSearchParams(searchParams);
      if (value.trim()) nextParams.set('search', value);
      else nextParams.delete('search');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchQuery.trim();
      navigate(query ? `/?search=${encodeURIComponent(query)}#products` : '/#products');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8F3E8]">
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
            <Link to="/" className="flex items-center gap-2 group shrink-0 sm:gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#D97706]/30 bg-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                {storeSettings.logoUrl && failedLogoUrl !== storeSettings.logoUrl ? (
                  <img
                    src={storeSettings.logoUrl}
                    alt="J&D Foods logo"
                    className="h-full w-full object-contain p-1"
                    onError={() => setFailedLogoUrl(storeSettings.logoUrl)}
                  />
                ) : (
                  <span className="bg-gradient-to-br from-[#8B1E1E] to-[#5C4033] bg-clip-text font-serif text-base font-bold text-transparent">J&amp;D</span>
                )}
              </div>
                  <div className="hidden min-[360px]:flex max-w-[86px] flex-col sm:max-w-[160px]">
                    <span className="text-[9px] font-serif font-bold tracking-wide text-[#5C4033] leading-tight sm:text-sm lg:text-base">
                  J&D FOODS
                </span>
                    <span className="hidden text-[9px] uppercase tracking-[0.16em] font-bold text-[#556B2F] leading-tight sm:block">
                  Heritage Delta Pickles
                </span>
              </div>
            </Link>

            <nav aria-label="Main navigation" className="hidden items-center gap-3 lg:flex xl:gap-5">
              {[
              { label: 'Home', to: '/', end: true },
              { label: 'Shop', to: '/#products', end: true },
              { label: 'Offers', to: '/offers' },
              { label: 'About', to: '/about' },
              { label: 'Reviews', to: '/reviews' },
              ].map(({ label, to, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                className={({ isActive }) => {
                  const isCurrentPage = label === 'Shop'
                    ? isActive && location.hash === '#products'
                    : label === 'Home'
                      ? isActive && location.hash !== '#products'
                      : isActive;
                  return `whitespace-nowrap text-[10px] font-bold uppercase tracking-wide transition-colors xl:text-xs ${
                    isCurrentPage ? 'text-[#8B1E1E]' : 'text-[#556B2F] hover:text-[#8B1E1E]'
                  }`;
                }}
              >
                {label}
              </NavLink>
              ))}
            </nav>

            {/* Middle — Search Bar */}
            <div className="flex-1 min-w-0 max-w-xl mx-3 hidden md:block lg:mx-6">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#556B2F]" />
                <input
                  type="text"
                  placeholder="Search pickles, podis, sweets, snacks..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/95 border border-[#5C4033]/20 focus:outline-none focus:border-[#D97706] focus:bg-white transition-all text-xs font-semibold text-[#5C4033] placeholder-[#5C4033]/45 shadow-inner"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/wishlist"
                className="relative rounded-xl p-2.5 text-[#556B2F] transition-all hover:bg-[#8B1E1E]/[0.08] hover:text-[#8B1E1E]"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#8B1E1E] text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile right side */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setIsSearchOpen((open) => !open)}
                className="p-1.5 rounded-full text-[#5C4033] hover:bg-white/70"
                aria-label="Toggle search"
              >
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="relative p-1.5 text-[#5C4033] hover:text-[#8B1E1E]" aria-label="Wishlist" title="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#8B1E1E] px-1 text-[9px] font-bold text-white">{wishlistCount}</span>}
              </Link>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-[#5C4033]/10 px-4 py-3"
            >
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#556B2F]" />
                <input
                  type="search"
                  placeholder="Search all products..."
                  value={searchQuery}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full rounded-full border border-[#5C4033]/15 bg-white py-2.5 pl-9 pr-4 text-sm text-[#5C4033] focus:border-[#D97706]"
                  aria-label="Search all products"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </header>
  );
};

export default Navbar;
