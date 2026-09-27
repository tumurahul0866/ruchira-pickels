import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, MessageCircle, Sparkles, Star } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { getStoreSettings, refreshStoreSettings, getProducts, getOffers, getProductTypes, getReviews } from '../services/dataStore';

const Home = () => {
  const [settings, setSettings] = useState(() => getStoreSettings());
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [storeSettings, fetchedProducts] = await Promise.all([
        refreshStoreSettings().catch(() => getStoreSettings()),
        getProducts(),
      ]);

      const visibleProducts = fetchedProducts.filter((product) => product.visible);
      const activeOffers = getOffers().filter((offer) => offer.active);
      const availableTypes = getProductTypes();
      const allReviews = getReviews().filter((r) => r.visible);

      setSettings(storeSettings);
      setProducts(visibleProducts);
      setProductTypes(availableTypes);
      setOffers(activeOffers);
      setReviews(allReviews.slice(0, 3));
    };

    loadData();
  }, []);

  const brandTagline = settings?.brandTagline || 'Authentic Andhra Pickles & Podis Handcrafted with Love.';
  const featuredOffer = offers.find((o) => o.code);
  const popularProducts = products.slice(0, 3);
  const categoryShortcuts = productTypes.map((type) => ({
    name: type,
    image: products.find((product) => product.productType?.toLowerCase() === type.toLowerCase())?.image || settings?.featureImageUrl,
  }));

  const handleWhatsAppOrder = () => {
    const text = 'Hi Vasuki Pickles! I would like to inquire about your pickle & podi products.';
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
    <div className="flex-grow bg-[#F8F3E8] text-[#5C4033]">
      <section className="px-3 pb-3 sm:px-4">
        <div className="max-w-[568px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative h-[260px] overflow-hidden rounded-[22px] border border-[#5C4033]/10 bg-[#5C4033] shadow-sm sm:h-[280px]"
          >
            {settings?.featureImageUrl ? (
              <img
                src={settings.featureImageUrl}
                alt="Andhra Avakaya Mango Pickle"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#EAE0D0]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#24140F]/90 via-[#24140F]/65 to-transparent" />

            <div className="absolute inset-y-0 left-0 flex max-w-[78%] flex-col items-start justify-center p-4 text-white sm:p-5">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#8B1E1E] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]">
                <Flame size={13} className="text-[#FFD700]" /> Bestseller
              </span>
              <h1 className="font-serif text-[25px] font-bold leading-tight sm:text-[28px]">
                Andhra Avakaya Mango Pickle
              </h1>
              <p className="mt-2 max-w-[250px] text-xs leading-relaxed text-white/90 sm:text-sm">
                {brandTagline}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to="/flavours"
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
        <div className="mx-auto max-w-[568px] rounded-[24px] border border-white/70 bg-white/60 p-2.5 shadow-sm">
          <div className="grid grid-cols-4 gap-1 sm:gap-2">
            {categoryShortcuts.map((category, idx) => (
              <div key={`${category.name}-${idx}`} className="min-w-0 text-center">
                <div className="mx-auto grid h-[76px] w-full max-w-[96px] place-items-center rounded-full bg-[#F8F3E8] p-1.5 sm:h-[88px]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-[#556B2F]/10" />
                  )}
                </div>
                <p className="mt-1.5 min-h-8 px-0.5 text-[10px] font-bold leading-tight text-[#5C4033] sm:text-[11px]">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredOffer && (
        <section className="px-3 pb-3 sm:px-4">
          <div className="mx-auto max-w-[568px]">
            <div className="rounded-[22px] bg-gradient-to-r from-[#8B1E1E] to-[#5C4033] p-4 text-white shadow-md">
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

      <section className="px-3 pb-4 sm:px-4">
        <div className="mx-auto max-w-[568px]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-serif font-bold text-[#556B2F]">Popular Pickles</h2>
            <Link to="/flavours" className="inline-flex items-center gap-1 text-xs font-bold text-[#556B2F]">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-[520px]:grid-flow-row min-[520px]:grid-cols-3 min-[520px]:auto-cols-auto min-[520px]:overflow-visible">
            {popularProducts.map((product) => (
              <div key={product.id} className="min-w-0">
                <ProductCard product={product} offer={offers[0]} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-6 sm:px-4">
        <div className="mx-auto max-w-[568px]">
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
