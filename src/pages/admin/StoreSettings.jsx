import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoreSettings, saveStoreSettings, uploadStoreLogo } from '../../services/dataStore';
import { Settings, Check, Phone, Mail, MapPin, MessageSquare, ImagePlus, Upload, X } from 'lucide-react';

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

const inputClass = "admin-form-field w-full rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none transition-all shadow-inner";

const StoreSettings = () => {
  const [settings, setSettings] = useState(() => {
    const s = getStoreSettings();
    return {
      logoUrl: s.logoUrl || '',
      businessName: s.businessName || 'J&D Foods',
      contactNumber: s.contactNumber || '+91 8885473903',
      email: s.email || 'support@konasemaruchulu.com',
      whatsappNumber: s.whatsappNumber || '+918885473903',
      whatsappMessage: s.whatsappMessage || 'Hi J&D Foods! I would like to place an order.',
      address: s.address || '123 Heritage Spice Lane, Jubilee Hills, Hyderabad, Telangana 500033',
      brandTagline: s.brandTagline || 'Handcrafted Heritage Pickles & Podis from Konasema Delta.',
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

  const handleSave = async (e) => {
    e.preventDefault();
    const logoUrl = settings.logoUrl.trim();
    const isUploadedImage = /^data:image\/(png|jpeg|webp);base64,/i.test(logoUrl);
    if (logoUrl && !isUploadedImage) {
      try {
        const parsedLogoUrl = new URL(logoUrl, window.location.origin);
        const isLocalPath = logoUrl.startsWith('/') && !logoUrl.startsWith('//') &&
          parsedLogoUrl.origin === window.location.origin;
        if (parsedLogoUrl.protocol !== 'https:' && !isLocalPath) {
          setMessageType('error');
          setMessage('Logo link must use HTTPS or be a path on this website.');
          return;
        }
      } catch {
        setMessageType('error');
        setMessage('Enter a valid logo link.');
        return;
      }
    }

    setSaving(true);
    setMessage('');
    try {
      const savedSettings = await saveStoreSettings({ ...settings, logoUrl });
      setSettings(savedSettings);
      setMessageType('success');
      setMessage('Store settings saved.');
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
          Store Settings
        </h1>
        <p className="text-xs text-brand-cream/60 mt-2 ml-1">
          Edit your store logo, brand, and contact details.
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
          <Field label="Or enter a logo image link" hint="Use an HTTPS image URL or a path on this website, then save settings.">
            <input
              type="text"
              name="logoUrl"
              value={settings.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className={inputClass}
            />
          </Field>
          {logoError && <p role="alert" className="text-xs font-semibold text-red-300">{logoError}</p>}
        </section>

        {/* Store Contact Details */}
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

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-brand-gold text-brand-black font-extrabold uppercase tracking-widest text-xs shadow-lg hover:bg-brand-gold-light transition-all disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving Settings...' : 'Save Store Settings'}
        </motion.button>
      </form>
    </div>
  );
};

export default StoreSettings;
