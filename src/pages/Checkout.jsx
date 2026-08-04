import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  saveOrder,
  getPaymentSettings,
  getStoreSettings,
  getUserProfile
} from '../services/dataStore';
import {
  CheckCircle2,
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';

const InputField = ({ label, name, type = 'text', required = true, value, onChange, placeholder, ...props }) => (
  <div>
    <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      {...props}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all placeholder-slate-400 font-medium"
    />
  </div>
);

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    paymentMethod: '',
    transactionId: '',
    notes: ''
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSettings, setPaymentSettings] = useState({ enableScanner: true, scannerNote: '' });
  const storeSettings = getStoreSettings();

  useEffect(() => {
    const ps = getPaymentSettings();
    setPaymentSettings(ps);
    // Auto-select the first enabled payment method
    const defaultMethod = ps.enableCOD ? 'COD' : ps.enableUPI ? 'UPI' : '';
    setFormData((prev) => ({ ...prev, paymentMethod: defaultMethod }));
    if (user?.email) {
      const profile = getUserProfile(user.email);
      if (profile) {
        setFormData((prev) => ({
          ...prev,
          name: profile.name || user.name || prev.name,
          email: user.email || prev.email,
          phone: profile.phone || user.phone || prev.phone,
          paymentMethod: defaultMethod
        }));
        if (profile.addresses && profile.addresses.length > 0) {
          setSavedAddresses(profile.addresses);
        }
      }
    }
  }, [user]);

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handleSelectSavedAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      address: addr.street || prev.address,
      city: addr.city || prev.city,
      state: addr.state || prev.state,
      pincode: addr.pincode || prev.pincode
    }));
  };

  const formatWhatsappMessage = (customer, createdId) => {
    const lines = [
      `🥒 *NEW ORDER CONFIRMATION - ACHARRUCHI* 🥒`,
      `*Order ID:* #${createdId}`,
      `*Customer Name:* ${customer.name}`,
      `*Phone Number:* ${customer.phone}`,
      `*Delivery Address:* ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
      `*Payment Method:* ${customer.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Digital Payment'}`,
      customer.paymentMethod === 'UPI' && customer.transactionId ? `*UPI Transaction ID / UTR:* ${customer.transactionId}` : '',
      '',
      `📦 *ORDERED ITEMS:*`
    ];

    cartItems.forEach((item) => {
      const itemTotal = item.weightOption.price * item.quantity;
      lines.push(`• *${item.product.name}* (${item.weightOption.weight}) × ${item.quantity} = ₹${itemTotal}`);
    });

    lines.push('', `💰 *TOTAL AMOUNT:* ₹${getCartTotal()}`);
    if (customer.notes) {
      lines.push(`📝 *Notes:* ${customer.notes}`);
    }
    lines.push('', 'Please confirm my order & dispatch details!');
    return lines.join('\n');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const normalizedValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: normalizedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter((field) => !formData[field].trim());

    if (missingFields.length > 0) {
      setErrorMessage('Please fill in all required delivery address fields.');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (formData.paymentMethod === 'UPI' && !formData.transactionId.trim()) {
      setErrorMessage('UPI Transaction ID / UTR Reference Number is MANDATORY for UPI payments.');
      return;
    }

    setErrorMessage('');

    const newOrder = {
      customer: { ...formData },
      items: cartItems,
      totalAmount: getCartTotal(),
      paymentMethod: formData.paymentMethod,
      date: new Date().toISOString()
    };

    const createdOrder = saveOrder(newOrder);
    const createdId = createdOrder.id;

    // Generate WhatsApp direct URL
    const rawPhone = storeSettings.whatsappNumber || '918885473903';
    const targetPhone = rawPhone.replace(/[^0-9]/g, '');
    const messageText = formatWhatsappMessage(formData, createdId);
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;

    setWhatsappUrl(url);
    setOrderId(createdId);
    clearCart();
    setOrderPlaced(true);

    // Direct launch WhatsApp immediately
    try {
      window.location.href = url;
    } catch (err) {
      console.log('Direct launch failed, fallback button available');
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-black p-4 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel max-w-lg w-full p-8 md:p-10 text-center rounded-3xl border border-brand-gold/20"
        >
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <CheckCircle2 size={44} />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs uppercase tracking-widest font-bold inline-block mb-3">
            Order Successfully Placed
          </span>

          <h2 className="text-3xl font-serif font-bold text-brand-cream mb-2">Thank You!</h2>
          <p className="text-sm text-brand-cream/70 mb-4">Your order details have been registered in our system.</p>

          <div className="p-4 rounded-2xl bg-brand-matte border border-white/10 mb-6 text-left space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Order Reference ID:</span>
              <strong className="font-mono text-brand-gold">{orderId}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Customer Name:</span>
              <strong className="text-slate-800">{formData.name}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Mobile Phone:</span>
              <strong className="text-slate-800">{formData.phone}</strong>
            </div>
          </div>

          {/* Primary Direct WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all mb-3"
          >
            <MessageSquare size={20} /> Open & Send Order on WhatsApp
          </a>

          <p className="text-xs text-brand-cream/50 mb-6">
            If WhatsApp didn't open automatically, tap the green button above to notify our kitchen instantly!
          </p>

          <Button variant="outline" onClick={() => navigate('/dashboard')} fullWidth className="py-3 text-xs">
            View Order Status in Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-brand-black min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
            <span className="text-brand-cream/60">Cart</span>
            <ChevronRight size={14} />
            <span className="text-brand-cream">Checkout & Delivery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-cream">Complete Your Order</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="flex-grow space-y-6">
            {/* Quick Saved Address Autofill */}
            {savedAddresses.length > 0 && (
              <div className="bg-brand-matte p-6 rounded-3xl border border-white/10">
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-gold mb-3 flex items-center gap-2">
                  <MapPin size={16} /> Quick Select Saved Delivery Address:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-brand-gold bg-slate-50 text-left transition-all text-xs"
                    >
                      <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-black font-bold text-[10px] uppercase">
                        {addr.label}
                      </span>
                      <p className="font-bold text-slate-900 mt-1">{addr.name || formData.name}</p>
                      <p className="text-slate-600 line-clamp-1">{addr.street}</p>
                      <p className="text-slate-500">{addr.city} - {addr.pincode}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-brand-matte p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              {/* Contact Details */}
              <div>
                <h2 className="text-lg font-serif font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                  <User size={18} className="text-brand-gold" /> Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Srikanth Reddy"
                  />
                  <InputField
                    label="10-Digit Mobile Phone *"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    placeholder="9876543210"
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label="Email Address (For e-receipt)"
                      name="email"
                      type="email"
                      required={false}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="srikanth@gmail.com"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-lg font-serif font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-brand-gold" /> Shipping Address
                </h2>
                <div className="space-y-4">
                  <InputField
                    label="Street / Flat / House No / Area *"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Flat 302, Green Hills Apartments, Jubilee Hills"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField
                      label="City *"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Hyderabad"
                    />
                    <InputField
                      label="State *"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Telangana"
                    />
                    <InputField
                      label="Pincode *"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="500033"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg font-serif font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-brand-gold" /> Choose Payment Option
                </h2>
                {!paymentSettings.enableCOD && !paymentSettings.enableUPI && (
                  <p className="text-sm text-rose-600 font-semibold p-4 bg-rose-50 rounded-2xl border border-rose-200">
                    ⚠️ No payment methods are currently enabled. Please contact us on WhatsApp to complete your order.
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentSettings.enableCOD && (
                    <label
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        formData.paymentMethod === 'COD'
                          ? 'border-brand-gold bg-brand-gold/10 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleChange}
                        className="mt-1 accent-brand-gold"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">Cash on Delivery (COD)</span>
                        <span className="text-xs text-slate-500">Pay cash upon delivery at doorstep</span>
                      </div>
                    </label>
                  )}

                  {paymentSettings.enableUPI && (
                    <label
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        formData.paymentMethod === 'UPI'
                          ? 'border-brand-gold bg-brand-gold/10 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={formData.paymentMethod === 'UPI'}
                        onChange={handleChange}
                        className="mt-1 accent-brand-gold"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">UPI Digital Scan (GPay/PhonePe)</span>
                        <span className="text-xs text-slate-500">Scan QR code using any UPI app</span>
                      </div>
                    </label>
                  )}
                </div>

                {/* QR Code Scanner display */}
                {formData.paymentMethod === 'UPI' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-center"
                  >
                    <p className="text-xs font-bold text-slate-800 mb-3">
                      Scan QR Code to pay <strong className="text-brand-gold text-sm">₹{getCartTotal()}</strong>:
                    </p>
                    <div className="w-44 h-44 bg-white mx-auto p-2 rounded-2xl border border-amber-300 shadow-sm mb-3">
                      <img
                        src={paymentSettings.qrImage}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-700">UPI ID: {paymentSettings.upiId || 'vasukipickles@upi'}</p>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">Accepts GPay, PhonePe, Paytm, BHIM</p>

                    {/* Mandatory Transaction ID Input */}
                    <div className="text-left bg-white p-3.5 rounded-xl border border-amber-300 shadow-sm">
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#8B1E1E] mb-1">
                        UPI Transaction ID / UTR Ref No. <span className="text-red-600 font-extrabold">* Required</span>
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 329182391024 or UTR reference"
                        className="w-full bg-amber-50/50 border border-amber-300 rounded-lg px-3.5 py-2 text-slate-900 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Enter the 12-digit UTR/Transaction reference number from your payment app.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1.5">
                  Order Notes or Delivery Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. Please send extra spicy Gongura, deliver after 2 PM..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Right Sidebar: Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-brand-matte p-6 rounded-3xl border border-white/10 shadow-sm sticky top-28 space-y-6">
              <h2 className="text-xl font-serif font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-slate-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {item.weightOption.weight} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-slate-900 font-mono">
                      ₹{item.weightOption.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Express Delivery</span>
                  <span className="font-bold text-emerald-600">
                    {getCartTotal() >= 999 ? 'FREE' : '₹60'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className="text-brand-green font-mono">
                    ₹{getCartTotal() >= 999 ? getCartTotal() : getCartTotal() + 60}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                className="py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Place Order & Launch WhatsApp
              </Button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                🛡️ Your order details are transmitted securely. No payment information stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
