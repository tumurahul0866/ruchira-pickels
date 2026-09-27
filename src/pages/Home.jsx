import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Leaf, Sparkles, Truck, ShieldCheck, Award, Star } from 'lucide-react';
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
      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-[28px] border border-[#5C4033]/10 bg-white shadow-sm"
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#8B1E1E]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1E1E]">
                  <Sparkles size={12} className="text-[#D97706]" /> Heritage
                </span>
                <span className="rounded-full bg-[#556B2F]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#556B2F]">
                  Bestseller
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight text-[#5C4033]">
                    Authentic Andhra <span className="text-[#8B1E1E]">Pickles</span>
                  </h1>

                  <p className="text-sm leading-relaxed text-[#5C4033]/75">
                    {brandTagline}
                  </p>

                  <div className="flex items-center gap-3">
                    <Link to="/flavours" className="flex-1">
                      <button className="w-full rounded-full bg-[#8B1E1E] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-md">
                        Shop Now
                      </button>
                    </Link>
                    <button
                      onClick={handleWhatsAppOrder}
                      className="rounded-full bg-[#556B2F] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[22px] bg-[#F8F3E8] border border-[#5C4033]/10">
                  {settings?.featureImageUrl ? (
                    <img
                      src={settings.featureImageUrl}
                      alt="Featured pickle"
                      className="h-52 w-full object-cover sm:h-60"
                    />
                  ) : (
                    <div className="h-52 w-full bg-[#EAE0D0] sm:h-60" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#5C4033]/90 via-[#5C4033]/55 to-transparent p-3 text-white">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#F8F3E8]/80">Featured</p>
                    <p className="mt-1 text-sm font-serif font-bold">Andhra Avakaya Mango Pickle</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-serif font-bold text-[#5C4033]">Popular Categories</h2>
            <Link to="/flavours" className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B1E1E]">
              View all
            </Link>
          </div>

          <div
            className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {categoryShortcuts.map((category, idx) => (
              <div key={`${category.name}-${idx}`} className="min-w-[112px] snap-start">
                <div className="rounded-[20px] border border-[#5C4033]/10 bg-white p-2 text-center shadow-sm">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-16 w-16 rounded-full object-cover mx-auto border-2 border-[#F8F3E8]"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-[#556B2F]/10 mx-auto" />
                  )}
                  <p className="mt-2 min-h-8 grid place-items-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#5C4033]">
                    {category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredOffer && (
        <section className="pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <section className="pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-serif font-bold text-[#5C4033]">Popular Pickles</h2>
            <Link to="/flavours" className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B1E1E]">
              See more
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {popularProducts.map((product) => (
              <div key={product.id} className="min-w-[250px] max-w-[260px] snap-start">
                <ProductCard product={product} offer={offers[0]} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromisesSection />

      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

const promises = [
  {
    icon: Leaf,
    title: '100% Natural',
    desc: 'No artificial preservatives or colors.',
    gradient: 'from-[#556B2F] to-[#6B8E23]',
  },
  {
    icon: ShieldCheck,
    title: 'Cold-Pressed Oil',
    desc: 'Prepared in traditional groundnut oil.',
    gradient: 'from-[#D97706] to-[#B45309]',
  },
  {
    icon: Award,
    title: 'Hygienic Jars',
    desc: 'Vacuum sealed with food-safe care.',
    gradient: 'from-[#8B1E1E] to-[#A52020]',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Express shipping across India.',
    gradient: 'from-[#5C4033] to-[#7A5540]',
  },
];

const PromisesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-4 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {promises.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="rounded-[20px] border border-[#5C4033]/10 bg-white p-3 shadow-sm"
            >
              <div className={`mb-2 inline-flex rounded-xl bg-gradient-to-br ${item.gradient} p-2 text-white`}>
                <item.icon size={16} />
              </div>
              <h3 className="text-sm font-serif font-bold text-[#5C4033]">{item.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-[#5C4033]/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
