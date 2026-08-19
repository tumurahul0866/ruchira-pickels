import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Leaf,
  Sparkles,
  Truck,
  ShieldCheck,
  Award,
  Star,
  ArrowRight,
  MessageSquare,
  Flame,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { getStoreSettings, getProducts, getOffers, getProductTypes, getReviews } from '../services/dataStore';

const Home = () => {
  const [settings, setSettings] = useState({});
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [reviews, setReviews] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const storeSettings = getStoreSettings();
      const visibleProducts = (await getProducts()).filter((product) => product.visible);
      const activeOffers = getOffers().filter((offer) => offer.active);
      const types = getProductTypes();
      const allReviews = getReviews().filter((r) => r.visible);

      setSettings(storeSettings);
      setProducts(visibleProducts);
      setOffers(activeOffers);
      setProductTypes(['All', ...types]);
      setReviews(allReviews.slice(0, 3));
    };
    loadData();
  }, []);

  const brandTagline = settings.brandTagline || 'Authentic Andhra Pickles & Podis Handcrafted with Love.';

  const displayedProducts =
    selectedType === 'All'
      ? products
      : products.filter((product) => product.productType === selectedType);

  const handleWhatsAppOrder = () => {
    const text = `Hi Vasuki Pickles! I would like to inquire about your pickle & podi products.`;
    const encoded = encodeURIComponent(text);
    const phone = settings.whatsappNumber || '918885473903';
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  // Use the first active offer with a code for the Home page banner
  const featuredOffer = offers.find((o) => o.code);

  const copyCouponCode = () => {
    if (!featuredOffer) return;
    navigator.clipboard.writeText(featuredOffer.code).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="flex-grow flex flex-col bg-[#F8F3E8] text-[#5C4033]">
      
      {/* 🌟 1. HERO SECTION - WARM CREAM & DEEP CHILLI RED HIGHLIGHTS */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-[#F8F3E8]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#8B1E1E]/20 text-[#8B1E1E] text-xs uppercase tracking-[0.2em] font-bold shadow-sm"
              >
                <Sparkles size={14} className="text-[#D97706] animate-pulse" /> HERITAGE GRANDMA RECIPES
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#5C4033] leading-tight tracking-tight"
              >
                Authentic Andhra <br />
                <span className="text-[#8B1E1E] font-serif">
                  Pickles & Karam Podis
                </span>
              </motion.h1>

              <p className="text-base sm:text-lg text-[#5C4033]/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Crafted to Crave. {brandTagline} Made using cold-pressed groundnut oil, Guntur chilies, and zero preservatives. Taste the true heritage of home!
              </p>

              {/* Stats Counters */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-8 border-t border-[#5C4033]/15">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-[#8B1E1E]">10,000+</p>
                  <p className="text-xs text-[#556B2F] font-semibold">Jars Shipped</p>
                </div>
                <div className="h-8 w-px bg-[#5C4033]/15 hidden sm:block" />
                <div>
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-[#8B1E1E]">4.9 ★</p>
                  <p className="text-xs text-[#556B2F] font-semibold">Customer Rating</p>
                </div>
                <div className="h-8 w-px bg-[#5C4033]/15 hidden sm:block" />
                <div>
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-[#8B1E1E]">100%</p>
                  <p className="text-xs text-[#556B2F] font-semibold">Cold-Pressed Oil</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/flavours" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#8B1E1E] hover:bg-[#D97706] text-white font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                    Explore All Pickles <ArrowRight size={18} />
                  </button>
                </Link>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#556B2F] hover:bg-[#6B8E23] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageSquare size={18} /> WhatsApp Quick Order
                </button>
              </div>
            </div>

            {/* Right Hero Showcase Image Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-white min-h-[400px]">
                  <img
                    src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80"
                    alt="Authentic Andhra Pickle Jar"
                    className="w-full h-[400px] sm:h-[460px] object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#5C4033] via-[#5C4033]/80 to-transparent p-6 text-white">
                    <span className="px-3 py-1 rounded-full bg-[#8B1E1E] text-white text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1 mb-2">
                      <Flame size={12} className="text-[#D97706]" /> BESTSELLER
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white">Andhra Avakaya Mango Pickle</h3>
                    <p className="text-xs text-[#F8F3E8]/80 mt-1">Sun-dried mangoes in traditional cold-pressed oil</p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 🛡️ 2. CORE PROMISES / TRUST & QUALITY HIGHLIGHTS SECTION */}
      <PromisesSection />

      {/* 🎁 3. OFFERS HIGHLIGHT BANNER — Dynamic from Admin */}
      {featuredOffer && (
        <section className="py-10 bg-[#F8F3E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-[28px] bg-gradient-to-r from-[#8B1E1E] to-[#5C4033] text-[#F8F3E8] p-8 sm:p-10 shadow-2xl border-2 border-[#D97706]/50 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6"
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-8 left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

              <div className="space-y-2.5 text-center lg:text-left z-10">
                <span className="px-3 py-1.5 rounded-full bg-[#D97706] text-white text-[10px] uppercase font-extrabold tracking-widest inline-flex items-center gap-1.5 shadow-md">
                  <Sparkles size={12} className="animate-pulse" /> {featuredOffer.discount}% OFF — Exclusive Deal
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
                  {featuredOffer.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F8F3E8]/90 leading-relaxed">
                  {featuredOffer.description}
                  {featuredOffer.minOrderValue > 0 && (
                    <> &nbsp;|&nbsp; Min order: ₹{featuredOffer.minOrderValue}</>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 z-10">
                <button
                  onClick={copyCouponCode}
                  className="px-6 py-3.5 rounded-full bg-[#D97706] hover:bg-white hover:text-[#8B1E1E] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg border-2 border-transparent hover:border-[#D97706]"
                >
                  {copiedCode ? (
                    <><Check size={16} /> Copied!</>
                  ) : (
                    <><Copy size={16} /> Copy Code: {featuredOffer.code}</>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="px-6 py-3.5 rounded-full bg-[#556B2F] hover:bg-[#6B8E23] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                >
                  <MessageSquare size={16} /> WhatsApp Order
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 🛍️ 4. PRODUCT CATALOG SHOWCASE */}
      <section className="py-12 md:py-20 bg-[#F8F3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#556B2F] block mb-2">
                Handcrafted Menu
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#5C4033]">
                Explore Our Pickle & Podi Varieties
              </h2>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {productTypes.map((type) => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    selectedType === type
                      ? 'bg-[#8B1E1E] text-white shadow-md'
                      : 'bg-white border border-[#5C4033]/20 text-[#5C4033] hover:border-[#D97706]'
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <ProductCard product={product} offer={offers[0]} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Link to="/flavours">
              <button className="px-8 py-3.5 rounded-full border-2 border-[#8B1E1E] text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-sm">
                View Full Catalog
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ⭐ 5. CUSTOMER REVIEWS SECTION */}
      <section className="py-16 bg-white border-t border-[#5C4033]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#556B2F] block mb-2">
              Loved by Foodies
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#5C4033] mb-3">
              What Our Customers Say
            </h2>
            <p className="text-sm text-[#5C4033]/70">
              Thousands of homes trust Vasuki Pickles for authentic regional flavor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(92,64,51,0.12)' }}
                className="p-6 rounded-[18px] bg-[#F8F3E8]/80 border border-[#5C4033]/10 flex flex-col justify-between shadow-sm cursor-default"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D97706] mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-[#5C4033] leading-relaxed italic mb-4">"{rev.text}"</p>
                </div>
                <div className="pt-4 border-t border-[#5C4033]/15 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#5C4033]">{rev.name}</h4>
                    <p className="text-xs text-[#556B2F] font-semibold">{rev.product}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#556B2F]/15 text-[#556B2F] text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Buyer
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

/* ─── Core Promises sub-component ─── */
const promises = [
  {
    icon: Leaf,
    title: '100% Natural Ingredients',
    desc: 'No artificial preservatives, synthetic colors, or chemicals.',
    gradient: 'from-[#556B2F] to-[#6B8E23]',
  },
  {
    icon: ShieldCheck,
    title: 'Cold-Pressed Groundnut Oil',
    desc: 'Prepared in traditional wood-pressed groundnut oil for rich health & aroma.',
    gradient: 'from-[#D97706] to-[#B45309]',
  },
  {
    icon: Award,
    title: '100% Hygienic Jar Safety',
    desc: 'Hygienically vacuum sealed in sterilized glass jars.',
    gradient: 'from-[#8B1E1E] to-[#A52020]',
  },
  {
    icon: Truck,
    title: 'Express Doorstep Shipping',
    desc: 'Fast express delivery across India with unbreakable packing.',
    gradient: 'from-[#5C4033] to-[#7A5540]',
  },
];

const PromisesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-14 bg-[#F8F3E8] border-y border-[#5C4033]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D97706] block mb-1">Our Commitment</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5C4033]">Core Promises</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group p-6 rounded-[20px] bg-white border border-[#5C4033]/08 flex items-start gap-4 hover:border-[#D97706]/30 hover:shadow-lg transition-all shadow-sm cursor-default"
            >
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shrink-0 shadow-md group-hover:scale-110 transition-transform`}
              >
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#5C4033] text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#5C4033]/65 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
