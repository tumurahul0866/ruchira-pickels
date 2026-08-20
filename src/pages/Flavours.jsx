import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { getProducts, getProductTypes, getOffers } from '../services/dataStore';

const Flavours = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSpice, setSelectedSpice] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');

  useEffect(() => {
    const loadData = async () => {
      const fetchedProducts = (await getProducts()).filter((p) => p.visible !== false);
      const fetchedTypes = getProductTypes();
      const fetchedOffers = getOffers().filter((o) => o.active);
      setProducts(fetchedProducts);
      setProductTypes(fetchedTypes);
      setOffers(fetchedOffers);
    };
    loadData();
  }, []);

  const availableTypes = ['All', ...productTypes];
  const spiceLevels = ['All', 'Sweet', 'Mild', 'Medium', 'Hot', 'Extra Hot'];

  let filteredProducts = products;

  if (selectedType !== 'All') {
    filteredProducts = filteredProducts.filter((p) => p.productType === selectedType);
  }

  if (selectedSpice !== 'All') {
    filteredProducts = filteredProducts.filter(
      (p) => p.spiceLevel?.toLowerCase() === selectedSpice.toLowerCase()
    );
  }

  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ingredients?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === 'low-high') {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (a.weights?.[0]?.price || 0) - (b.weights?.[0]?.price || 0)
    );
  } else if (sortBy === 'high-low') {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.weights?.[0]?.price || 0) - (a.weights?.[0]?.price || 0)
    );
  }

  return (
    <div className="flex-grow bg-[#F8F3E8] text-[#5C4033] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#556B2F]/15 text-[#556B2F] text-xs uppercase font-bold tracking-widest">
            <Sparkles size={14} className="text-[#D97706]" /> Handcrafted Menu
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#5C4033]">
            Explore Our Flavours
          </h1>
          <p className="text-sm sm:text-base text-[#5C4033]/80">
            From traditional sun-dried Avakaya to fiery chicken pickles, sweets, snacks and fragrant karam podis.
          </p>
        </motion.div>

        {/* Aesthetic Filter & Search Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[28px] p-6 sm:p-8 border-2 border-[#5C4033]/12 shadow-md space-y-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input Box */}
            <div className="relative w-full lg:w-96">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#556B2F]" />
              <input
                type="text"
                placeholder="Search pickle, podi, sweet or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/15 focus:outline-none focus:border-[#D97706] focus:bg-white text-xs font-semibold text-[#5C4033] placeholder-[#5C4033]/45 shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C4033]/60 hover:text-[#5C4033]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Right Side Options — Sort Dropdown */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <span className="text-xs uppercase font-bold text-[#5C4033]/70 shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F8F3E8] border border-[#5C4033]/20 rounded-full px-4 py-2.5 text-xs font-bold text-[#5C4033] focus:outline-none focus:border-[#D97706] cursor-pointer"
              >
                <option value="default">Featured / Bestsellers</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2 border-t border-[#5C4033]/10 pt-4">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#556B2F] block mb-2">
              Category Type
            </span>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map((type) => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                    selectedType === type
                      ? 'bg-[#8B1E1E] text-white shadow-md'
                      : 'bg-[#F8F3E8] text-[#5C4033] hover:bg-[#D97706]/15 hover:text-[#D97706] border border-[#5C4033]/10'
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Taste / Spice Level Filter Pills */}
          <div className="space-y-2 border-t border-[#5C4033]/10 pt-4">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#D97706] block mb-2">
              Taste / Spice Level
            </span>
            <div className="flex flex-wrap gap-2">
              {spiceLevels.map((spice) => (
                <motion.button
                  key={spice}
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSpice(spice)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedSpice === spice
                      ? 'bg-[#D97706] text-white shadow-sm'
                      : 'bg-white text-[#5C4033]/70 hover:text-[#5C4033] border border-[#5C4033]/15'
                  }`}
                >
                  {spice}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-bold text-[#5C4033]/70 px-2">
          <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'variety' : 'varieties'}</span>
          {(selectedType !== 'All' || selectedSpice !== 'All' || searchQuery) && (
            <button
              onClick={() => { setSelectedType('All'); setSelectedSpice('All'); setSearchQuery(''); }}
              className="text-[#8B1E1E] hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid Showcase */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <ProductCard product={product} offer={offers[0]} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#5C4033]/15 space-y-3">
            <h3 className="text-xl font-serif font-bold text-[#5C4033]">No products match your criteria</h3>
            <p className="text-xs text-[#5C4033]/70">Try adjusting your search query or reset category filters.</p>
            <button
              onClick={() => { setSelectedType('All'); setSelectedSpice('All'); setSearchQuery(''); }}
              className="px-6 py-2.5 rounded-full bg-[#8B1E1E] text-white text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Flavours;
