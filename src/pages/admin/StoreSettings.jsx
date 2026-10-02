import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoreSettings, saveStoreSettings, uploadStoreLogo } from '../../services/dataStore';
import { Settings, Check, Phone, Mail, MapPin, Truck, MessageSquare, BookOpen, ImagePlus, Upload, X } from 'lucide-react';

const Field = ({ label, icon: Icon, hint, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold text-brand-gold">
      {Icon && <Icon size={14} className="text-brand-gold" />}
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-brand-cream/50 pl-1">{hint}</p>}
  </div>
);

const inputClass = "w-full bg-white border-2 border-brand-gold/30 rounded-2xl px-4 py-3 text-gray-900 text-sm font-semibold focus:outline-none focus:border-brand-gold transition-all placeholder-gray-400 shadow-inner";
const textareaClass = "w-full bg-white border-2 border-brand-gold/30 rounded-2xl px-4 py-3 text-gray-900 text-sm font-semibold focus:outline-none focus:border-brand-gold transition-all placeholder-gray-400 shadow-inner resize-none";

const StoreSettings = () => {
  const [settings, setSettings] = useState(() => {
    const s = getStoreSettings();
    return {
      logoUrl: s.logoUrl || '',
      businessName: s.businessName || 'JD Foods',
      contactNumber: s.contactNumber || '+91 8885473903',
      email: s.email || 'support@konasemaruchulu.com',
      whatsappNumber: s.whatsappNumber || '+918885473903',
      whatsappMessage: s.whatsappMessage || 'Hi JD Foods! I would like to place an order.',
      address: s.address || '123 Heritage Spice Lane, Jubilee Hills, Hyderabad, Telangana 500033',
      freeShippingEnabled: s.freeShippingEnabled !== false,
      minFreeShippingAmount: s.minFreeShippingAmount || 999,
      heroTitle: s.heroTitle || 'KONASEMA RUCHULU',
      brandTagline: s.brandTagline || 'Handcrafted Heritage Pickles & Podis from Konasema Delta.',
      aboutTitle: s.aboutTitle || 'Preserving Authentic Konasema Pickling Traditions',
      aboutStory: s.aboutStory || 'JD Foods is crafted with traditional heirloom recipes, farm-fresh ingredients, and bold regional flavors from the fertile Konasema delta. Every jar is prepared with care to bring rich homemade taste to every meal.',
      aboutStory2: s.aboutStory2 || 'What started as a family tradition has blossomed into a trusted brand dedicated to preserving the authentic culinary heritage of South India. We believe that a meal is incomplete without that perfect touch of spice, tanginess, and aromatic cold-pressed groundnut oil.',
      aboutReasonTitle: s.aboutReasonTitle || 'The Essence of Konasema',
      aboutReasonText: s.aboutReasonText || 'Symbolizes agricultural richness, warmth, and legendary culinary heritage. Like timeless recipes passed through generations, our pickles are bold, memorable, and packaged in food-grade glass jars and sealed pouches without chemical shortcuts.',
      aboutPromise1Title: s.aboutPromise1Title || '100% Natural Ingredients',
      aboutPromise1Desc: s.aboutPromise1Desc || 'Sourced directly from local Andhra farmers to ensure authentic spice, color, and freshness in every jar.',
      aboutPromise2Title: s.aboutPromise2Title || 'Traditional Wood-Pressed Oil',
      aboutPromise2Desc: s.aboutPromise2Desc || 'Slow-extracted groundnut oil retains wholesome aroma and natural health benefits without chemical refining.',
      aboutPromise3Title: s.aboutPromise3Title || 'Made with Love',
      aboutPromise3Desc: s.aboutPromise3Desc || 'Hand-mixed in hygienic small batches with the same devotion and care as for our own family.'
    };
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({ ...settings, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const savedSettings = await saveStoreSettings(settings);
      setSettings(savedSettings);
      setMessageType('success');
      setMessage('Store and About page settings saved.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Unable to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setLogoError('');
    setUploadingLogo(true);
    try {
      const logoUrl = await uploadStoreLogo(file);
      setSettings((current) => ({ ...current, logoUrl }));
      setMessageType('success');
      setMessage('Store logo uploaded successfully.');
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : 'Unable to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setSettings((current) => ({ ...current, logoUrl: '' }));
    setLogoError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-3xl font-serif font-bold text-brand-cream flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-brand-gold/10 border border-brand-gold/20">
            <Settings size={22} className="text-brand-gold" />
          </span>
          Store Settings & About Us Content Editor
        </h1>
        <p className="text-xs text-brand-cream/60 mt-2 ml-1">
          Edit brand info, contact details, About Us story text, core promises, and shipping thresholds.
        </p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`p-4 text-sm font-bold flex items-center gap-2 ${messageType === 'success' ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300' : 'bg-red-500/10 border border-red-500/40 text-red-200'}`}
          >
            {messageType === 'success' && <Check size={18} />} {message}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="p-6 md:p-8 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-5 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-white/10">
            <ImagePlus size={18} /> Website Logo
          </h2>
          <p className="text-xs text-brand-cream/60">
            Upload a PNG, JPEG, or WebP image up to 500 KB. The logo appears in the storefront navigation.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-xl border border-white/15 bg-white p-2">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Current website logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="font-serif text-2xl font-bold text-[#8B1E1E]">JD</span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-extrabold text-brand-black transition-opacity ${uploadingLogo ? 'pointer-events-none opacity-60' : 'hover:opacity-90'}`}>
                <Upload size={15} />
                {uploadingLogo ? 'Uploading...' : settings.logoUrl ? 'Change Logo' : 'Add Logo'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="sr-only"
                />
              </label>
              {settings.logoUrl && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-bold text-brand-cream transition-colors hover:bg-white/5"
                >
                  <X size={15} /> Remove
                </button>
              )}
            </div>
          </div>
          {logoError && <p role="alert" className="text-xs font-semibold text-red-300">{logoError}</p>}
        </section>

        {/* SECTION 1: ABOUT US PAGE TEXT CONTENT EDITOR */}
        <section className="p-6 md:p-8 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-6 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-white/10">
            <BookOpen size={18} /> About Us Page Content & Core Promises
          </h2>

          <div className="space-y-5">
            <Field label="About Us Main Headline Title">
              <input type="text" name="aboutTitle" value={settings.aboutTitle} onChange={handleChange} required className={inputClass} />
            </Field>

            <Field label="Heritage Story Paragraph 1">
              <textarea name="aboutStory" value={settings.aboutStory} onChange={handleChange} rows={3} required className={textareaClass} />
            </Field>

            <Field label="Heritage Story Paragraph 2">
              <textarea name="aboutStory2" value={settings.aboutStory2} onChange={handleChange} rows={3} required className={textareaClass} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-white/10">
              <Field label="Featured Box Title (The Essence of Konasema)">
                <input type="text" name="aboutReasonTitle" value={settings.aboutReasonTitle} onChange={handleChange} required className={inputClass} />
              </Field>
              <Field label="Featured Box Description">
                <textarea name="aboutReasonText" value={settings.aboutReasonText} onChange={handleChange} rows={2} required className={textareaClass} />
              </Field>
            </div>

            {/* Core Promises Titles & Descriptions */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-brand-gold">Our Core Promises (3 Cards)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Promise 1 */}
                <div className="bg-brand-black p-4 rounded-2xl border border-white/10 space-y-2">
                  <Field label="Promise 1 Title">
                    <input type="text" name="aboutPromise1Title" value={settings.aboutPromise1Title} onChange={handleChange} required className={inputClass} />
                  </Field>
                  <Field label="Description">
                    <textarea name="aboutPromise1Desc" value={settings.aboutPromise1Desc} onChange={handleChange} rows={3} required className={textareaClass} />
                  </Field>
                </div>

                {/* Promise 2 */}
                <div className="bg-brand-black p-4 rounded-2xl border border-white/10 space-y-2">
                  <Field label="Promise 2 Title">
                    <input type="text" name="aboutPromise2Title" value={settings.aboutPromise2Title} onChange={handleChange} required className={inputClass} />
                  </Field>
                  <Field label="Description">
                    <textarea name="aboutPromise2Desc" value={settings.aboutPromise2Desc} onChange={handleChange} rows={3} required className={textareaClass} />
                  </Field>
                </div>

                {/* Promise 3 */}
                <div className="bg-brand-black p-4 rounded-2xl border border-white/10 space-y-2">
                  <Field label="Promise 3 Title">
                    <input type="text" name="aboutPromise3Title" value={settings.aboutPromise3Title} onChange={handleChange} required className={inputClass} />
                  </Field>
                  <Field label="Description">
                    <textarea name="aboutPromise3Desc" value={settings.aboutPromise3Desc} onChange={handleChange} rows={3} required className={textareaClass} />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Contact Details */}
        <section className="p-6 md:p-8 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-6 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-white/10">
            <Mail size={18} /> Store Contact Details & Business Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Business Name" icon={Settings}>
              <input type="text" name="businessName" value={settings.businessName} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Contact Phone Number" icon={Phone}>
              <input type="text" name="contactNumber" value={settings.contactNumber} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Contact Email Address" icon={Mail}>
              <input type="email" name="email" value={settings.email} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="WhatsApp Phone Number" icon={MessageSquare}>
              <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} required className={inputClass} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Store Physical Address" icon={MapPin}>
                <input type="text" name="address" value={settings.address} onChange={handleChange} required className={inputClass} />
              </Field>
            </div>
          </div>
        </section>

        {/* SECTION 3: Shipping Controls */}
        <section className="p-6 md:p-8 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-6 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-white/10">
            <Truck size={18} /> Shipping Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-brand-gold/30 cursor-pointer"
              onClick={() => setSettings({ ...settings, freeShippingEnabled: !settings.freeShippingEnabled })}>
              <input type="checkbox" checked={settings.freeShippingEnabled} onChange={() => {}} className="h-5 w-5 rounded accent-brand-gold cursor-pointer" />
              <div>
                <p className="text-sm font-extrabold text-gray-900">Free Shipping Option</p>
                <p className="text-xs text-gray-600">Offer free shipping on orders over threshold</p>
              </div>
            </div>
            <Field label="Min Order for Free Shipping (₹)">
              <input type="number" name="minFreeShippingAmount" value={settings.minFreeShippingAmount} onChange={handleChange} min="0" className={inputClass} />
            </Field>
          </div>
        </section>

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-brand-gold text-brand-black font-extrabold uppercase tracking-widest text-xs shadow-lg hover:bg-brand-gold-light transition-all"
        >
          {saving ? 'Saving Settings...' : 'Save Store Settings'}
        </motion.button>
      </form>
    </div>
  );
};

export default StoreSettings;
