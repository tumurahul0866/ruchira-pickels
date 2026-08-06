import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPaymentSettings, updatePaymentSettings } from '../../services/dataStore';
import { CreditCard, QrCode, Check, AlertCircle, Banknote, Smartphone } from 'lucide-react';

const inputClass = "w-full bg-brand-black border-2 border-white/10 rounded-2xl px-4 py-3 text-brand-cream text-sm font-medium focus:outline-none focus:border-brand-gold transition-all placeholder-brand-cream/20";

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs uppercase tracking-widest font-bold text-brand-cream/60">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-brand-cream/30 pl-0.5">{hint}</p>}
  </div>
);

const ToggleRow = ({ icon: Icon, title, subtitle, enabled, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    onClick={onClick}
    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
      enabled ? 'border-brand-gold/40 bg-brand-gold/5' : 'border-white/8 bg-brand-black hover:border-white/15'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
      enabled ? 'bg-brand-gold/15 text-brand-gold' : 'bg-white/5 text-brand-cream/30'
    }`}>
      <Icon size={18} />
    </div>
    <div className="flex-1">
      <p className={`text-sm font-bold transition-colors ${enabled ? 'text-brand-cream' : 'text-brand-cream/60'}`}>{title}</p>
      <p className="text-[11px] text-brand-cream/40 mt-0.5">{subtitle}</p>
    </div>
    <div className={`w-11 h-6 rounded-full border-2 transition-all flex items-center px-0.5 ${
      enabled ? 'bg-brand-gold border-brand-gold' : 'bg-white/10 border-white/20'
    }`}>
      <motion.div
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-white shadow-md"
      />
    </div>
  </motion.div>
);

const PaymentSettings = () => {
  const [settings, setSettings] = useState(() => getPaymentSettings());
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({ ...settings, [name]: type === 'checkbox' ? checked : value });
  };

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePaymentSettings(settings);
    setMessage({ type: 'success', text: 'Payment settings saved! Customers will see updated options immediately.' });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-3xl font-serif font-bold text-brand-cream flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-brand-gold/10 border border-brand-gold/20">
            <CreditCard size={22} className="text-brand-gold" />
          </span>
          Payment Settings
        </h1>
        <p className="text-xs text-brand-cream/40 mt-2 ml-1">
          Enable or disable payment methods and configure UPI payment details.
        </p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-2 text-sm font-semibold p-4 rounded-2xl border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Payment Method Toggles */}
        <section className="p-6 rounded-3xl bg-[#0f0f0f] border border-white/8 space-y-4">
          <h2 className="text-sm font-bold text-brand-gold uppercase tracking-widest pb-3 border-b border-white/8">
            🔘 Payment Methods
          </h2>
          <div className="space-y-3">
            <ToggleRow
              icon={Banknote}
              title="Cash on Delivery (COD)"
              subtitle="Customer pays cash when order is delivered to the doorstep"
              enabled={settings.enableCOD}
              onClick={() => toggle('enableCOD')}
            />
            <ToggleRow
              icon={Smartphone}
              title="UPI Digital Payment"
              subtitle="Customer pays via GPay, PhonePe, Paytm, or BHIM before delivery"
              enabled={settings.enableUPI}
              onClick={() => toggle('enableUPI')}
            />
            <ToggleRow
              icon={QrCode}
              title="Show UPI QR Code Scanner"
              subtitle="Display a scannable QR code on the checkout page"
              enabled={settings.enableScanner}
              onClick={() => toggle('enableScanner')}
            />
          </div>

          {!settings.enableCOD && !settings.enableUPI && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
              <AlertCircle size={15} />
              Warning: All payment methods are disabled! Customers will not be able to complete checkout.
            </div>
          )}
        </section>

        {/* UPI Details */}
        {settings.enableUPI && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 rounded-3xl bg-[#0f0f0f] border border-white/8 space-y-5"
          >
            <h2 className="text-sm font-bold text-brand-gold uppercase tracking-widest pb-3 border-b border-white/8">
              📱 UPI Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="UPI ID" hint="e.g. yourname@okaxis or 9876543210@ybl">
                <input
                  name="upiId"
                  type="text"
                  value={settings.upiId}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="vasukipickles@okaxis"
                />
              </Field>
              <Field label="Scanner Tagline" hint="Short text shown below the QR code">
                <input
                  name="scannerNote"
                  type="text"
                  value={settings.scannerNote}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Scan with any UPI app to pay"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="QR Code Image URL" hint="Direct link to your UPI QR code image (PNG or JPG)">
                  <input
                    name="qrImage"
                    type="url"
                    value={settings.qrImage}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://example.com/your-upi-qr.png"
                  />
                </Field>
              </div>
            </div>

            {settings.qrImage && (
              <div>
                <p className="text-xs text-brand-cream/40 uppercase tracking-widest mb-2 font-bold">QR Preview</p>
                <div className="w-36 h-36 rounded-2xl border-2 border-brand-gold/20 overflow-hidden bg-white p-1">
                  <img src={settings.qrImage} alt="QR Preview" className="w-full h-full object-contain rounded-xl" />
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Instructions */}
        <section className="p-6 rounded-3xl bg-[#0f0f0f] border border-white/8">
          <h2 className="text-sm font-bold text-brand-gold uppercase tracking-widest pb-3 border-b border-white/8 mb-5">
            📝 Payment Instructions (shown to customer)
          </h2>
          <Field label="Payment Instructions Text" hint="This appears as a helper note on the checkout page">
            <textarea
              name="instructions"
              rows={4}
              value={settings.instructions}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              placeholder="e.g. After scanning the QR code and completing payment, copy your UTR number from your payment app..."
            />
          </Field>
        </section>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-light transition-all"
        >
          Save Payment Settings
        </motion.button>
      </form>
    </div>
  );
};

export default PaymentSettings;
