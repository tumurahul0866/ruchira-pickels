import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Star } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { getStoreSettings, refreshStoreSettings, getProducts, getOffers, getReviews } from '../services/dataStore';

const homeCategories = ['All', 'Pickles', 'Podis', 'Non Veg', 'Sweets', 'Snacks'];
const snackProductName = /gavvalu|chekkalu|murukku|murukulu|mixture|chips|namkeen|snack|cracker/i;

const matchesCategory = (product, category) => {
  const type = String(product.productType || '').toLowerCase();
  const productCategory = String(product.category || '').toLowerCase();
  const name = String(product.name || '');
  const isNonVeg = /non[\s-]?veg/.test(`${type} ${productCategory}`);

  switch (category) {
    case 'Pickles':
      return type.includes('pickle') && !isNonVeg;
    case 'Podis':
      return type.includes('podi');
    case 'Non Veg':
      return isNonVeg;
    case 'Sweets':
      return (type.includes('sweet') || productCategory.includes('sweet')) && !snackProductName.test(name);
    case 'Snacks':
      return type.trim() === 'snacks' || productCategory.includes('snack') ||
        (type.includes('snack') && snackProductName.test(name));
    default:
      return true;
  }
};

const Home = () => {
  const [settings, setSettings] = useState(() => getStoreSettings());
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [offers] = useState(() => getOffers().filter((offer) => offer.active));
  const [reviews] = useState(() => getReviews().filter((review) => review.visible).slice(0, 3));
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    let isMounted = true;

    getProducts().then((fetchedProducts) => {
      if (isMounted) {
        setProducts(fetchedProducts.filter((product) => product.visible !== false));
      }
    }).finally(() => {
      if (isMounted) setIsLoadingProducts(false);
    });

    refreshStoreSettings()
      .catch(() => getStoreSettings())
      .then((storeSettings) => {
        if (isMounted) setSettings(storeSettings);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredOffer = offers.find((o) => o.code);
  const filteredProducts = products.filter((product) => {
    if (!matchesCategory(product, selectedCategory)) return false;
    if (!searchQuery.trim()) return true;

    const searchableText = [
      product.name,
      product.description,
      product.ingredients,
      product.category,
      product.productType,
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableText.includes(searchQuery.trim().toLowerCase());
  });

  const handleWhatsAppOrder = () => {
    const text = `Hi ${settings?.businessName || 'J&D Foods'}! I would like to inquire about your pickle & podi products.`;
    const encoded = encodeURIComponent(text);
    const phone = settings?.whatsappNumber || '918885473903';
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  const copyCouponCode = () => {
    if (!featuredOffer) return;
    navigator.clipboard.writeText(featuredOffer.code).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="flex-grow bg-[#F8F3E8] pt-4 text-[#5C4033] sm:pt-5">
      <section className="px-3 pb-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative h-[230px] overflow-hidden rounded-none border border-[#5C4033]/10 bg-[#EAE0D0] shadow-sm sm:h-[280px] lg:h-[320px]"
          >
            {settings?.featureImageUrl ? (
              <img
                src={settings.featureImageUrl}
                alt="Andhra Avakaya Mango Pickle"
                className="absolute inset-0 h-full w-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 bg-[#EAE0D0]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#24140F]/90 via-[#24140F]/65 to-transparent" />

            <div className="absolute bottom-0 left-0 flex max-w-[84%] items-end p-4 text-white sm:max-w-[58%] sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/#products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#556B2F] px-4 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  Shop Now <ArrowRight size={15} />
                </Link>
                <button
                  onClick={handleWhatsAppOrder}
                  aria-label="Order on WhatsApp"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm"
                >
                  <MessageCircle size={17} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-3 pb-4 sm:px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {homeCategories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                  selectedCategory === category
                    ? 'border-[#556B2F] bg-[#556B2F] text-white'
                    : 'border-[#5C4033]/15 bg-white text-[#5C4033] hover:border-[#556B2F]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {featuredOffer && (
        <section className="px-3 pb-3 sm:px-4">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-none bg-gradient-to-r from-[#8B1E1E] to-[#5C4033] p-4 text-white shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#F8F3E8]/80">Offer</p>
                  <p className="mt-1 text-base font-serif font-bold">{featuredOffer.title}</p>
                </div>

                <button
                  onClick={copyCouponCode}
                  className="rounded-full bg-[#D97706] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
                >
                  {copiedCode ? 'Copied' : featuredOffer.code}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="products" className="scroll-mt-28 px-3 pb-4 sm:px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#556B2F]">Popular Products</h2>
              <p className="mt-1 text-xs text-[#5C4033]/65">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} offer={offers[0]} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#5C4033]/10 bg-white p-8 text-center">
              <h3 className="font-serif text-lg font-bold text-[#5C4033]">
                {isLoadingProducts
                  ? 'Loading products...'
                  : products.length === 0
                    ? 'No products available'
                    : 'No products match these filters'}
              </h3>
              <p className="mt-1 text-sm text-[#5C4033]/65">
                {isLoadingProducts
                  ? 'Please wait a moment.'
                  : products.length === 0
                    ? 'Products added from the admin portal will appear here.'
                    : 'Try another category or search.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-3 pb-6 sm:px-4">
          <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-serif font-bold text-[#5C4033]">What Our Customers Say</h2>
            <Link to="/reviews" className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B1E1E]">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-[20px] border border-[#5C4033]/10 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1 text-[#D97706] mb-2">
                  {[...Array(rev.rating || 5)].map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-[#5C4033]/80 leading-relaxed italic">“{rev.text}”</p>
                <div className="mt-3 border-t border-[#5C4033]/10 pt-3">
                  <p className="text-sm font-serif font-bold text-[#5C4033]">{rev.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#556B2F]">Verified Buyer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
