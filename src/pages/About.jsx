import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Heart, Sparkles } from 'lucide-react';
import { getStoreSettings } from '../services/dataStore';

const About = () => {
  const [settings, setSettings] = useState({
    aboutTitle: 'Preserving Authentic Konasema Pickling Traditions',
    aboutStory: 'Konasema Ruchulu is crafted with traditional heirloom recipes, farm-fresh ingredients, and bold regional flavors from the fertile Konasema delta. Every jar is prepared with care to bring rich homemade taste to every meal.',
    aboutStory2: 'What started as a family tradition has blossomed into a trusted brand dedicated to preserving the authentic culinary heritage of South India. We believe that a meal is incomplete without that perfect touch of spice, tanginess, and aromatic cold-pressed groundnut oil.',
    aboutReasonTitle: 'The Essence of Konasema',
    aboutReasonText: 'Symbolizes agricultural richness, warmth, and legendary culinary heritage. Like timeless recipes passed through generations, our pickles are bold, memorable, and packaged in food-grade glass jars and sealed pouches without chemical shortcuts.',
    aboutImageUrl: 'https://images.unsplash.com/photo-1506544777-64cfb638973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    aboutPromise1Title: '100% Natural Ingredients',
    aboutPromise1Desc: 'Sourced directly from local Andhra farmers to ensure authentic spice, color, and freshness in every jar.',
    aboutPromise2Title: 'Traditional Wood-Pressed Oil',
    aboutPromise2Desc: 'Slow-extracted groundnut oil retains wholesome aroma and natural health benefits without chemical refining.',
    aboutPromise3Title: 'Made with Love',
    aboutPromise3Desc: 'Hand-mixed in hygienic small batches with the same devotion and care as for our own family.'
  });

  useEffect(() => {
    const s = getStoreSettings();
    if (s) {
      setSettings((prev) => ({ ...prev, ...s }));
    }
  }, []);

  return (
    <div className="flex-grow bg-[#F8F3E8] text-[#5C4033] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header / Intro Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1E1E]/10 border border-[#8B1E1E]/20 text-[#8B1E1E] text-xs uppercase tracking-[0.2em] font-extrabold">
              <Sparkles size={14} className="text-[#D97706]" /> Our Heritage & Story
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#5C4033] leading-tight">
              {settings.aboutTitle || 'Preserving Authentic Konasema Pickling Traditions'}
            </h1>

            <p className="text-[#5C4033]/85 text-base sm:text-lg leading-relaxed font-medium">
              {settings.aboutStory}
            </p>

            <p className="text-[#5C4033]/75 text-sm sm:text-base leading-relaxed">
              {settings.aboutStory2}
            </p>

            <div className="p-6 rounded-3xl bg-white text-[#5C4033] border-2 border-[#5C4033]/15 shadow-md space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#8B1E1E]">{settings.aboutReasonTitle || 'The Essence of Konasema'}</h3>
              <p className="text-xs sm:text-sm text-[#5C4033]/85 leading-relaxed font-medium">
                {settings.aboutReasonText}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[32px] overflow-hidden border-2 border-[#5C4033]/20 shadow-2xl bg-white h-[450px] sm:h-[550px]">
              {settings.aboutImageUrl ? (
                <img 
                  src={settings.aboutImageUrl} 
                  alt="Konasema Heritage Pickling Ingredients" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#5C4033]/10 text-xs text-[#5C4033]/60 italic">
                  Image removed in Admin
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="px-3.5 py-1 rounded-full bg-[#FFD700] text-black text-[10px] font-extrabold uppercase tracking-widest self-start mb-2 shadow-md">
                  100% Homemade Taste
                </span>
                <h3 className="text-xl font-serif font-bold text-white">Sun-Dried & Stone-Ground</h3>
                <p className="text-xs text-white/80">Prepared using cold-pressed groundnut oil in glass jars & seal pouches</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Promises Section — Redesigned with High Contrast & Vibrant Warm Colors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-[#8B1E1E] to-[#5C4033] text-white rounded-[36px] p-8 sm:p-12 shadow-2xl border-2 border-[#D97706]/30"
        >
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#FFD700] block">
              Our Core Promises
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Why Families Choose Konasema Ruchulu
            </h2>
            <p className="text-xs sm:text-sm text-white/80">
              Uncompromising quality, heirloom recipes, and hygienic preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-7 rounded-3xl border-2 border-[#FFD700]/40 text-center shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 mx-auto bg-[#8B1E1E]/10 text-[#8B1E1E] rounded-2xl flex items-center justify-center mb-4 border border-[#8B1E1E]/20">
                <Leaf size={28} className="text-[#8B1E1E]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#8B1E1E] mb-2">
                {settings.aboutPromise1Title || '100% Natural Ingredients'}
              </h3>
              <p className="text-xs text-[#5C4033] leading-relaxed font-medium">
                {settings.aboutPromise1Desc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-7 rounded-3xl border-2 border-[#FFD700]/40 text-center shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 mx-auto bg-[#D97706]/10 text-[#D97706] rounded-2xl flex items-center justify-center mb-4 border border-[#D97706]/20">
                <Award size={28} className="text-[#D97706]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#8B1E1E] mb-2">
                {settings.aboutPromise2Title || 'Traditional Wood-Pressed Oil'}
              </h3>
              <p className="text-xs text-[#5C4033] leading-relaxed font-medium">
                {settings.aboutPromise2Desc}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-7 rounded-3xl border-2 border-[#FFD700]/40 text-center shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 mx-auto bg-[#556B2F]/10 text-[#556B2F] rounded-2xl flex items-center justify-center mb-4 border border-[#556B2F]/20">
                <Heart size={28} className="text-[#556B2F]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#8B1E1E] mb-2">
                {settings.aboutPromise3Title || 'Made with Love'}
              </h3>
              <p className="text-xs text-[#5C4033] leading-relaxed font-medium">
                {settings.aboutPromise3Desc}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;
