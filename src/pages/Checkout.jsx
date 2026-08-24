import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  saveOrder,
  getPaymentSettings,
  getStoreSettings,
  getUserProfile,
  getUserProfileAsync,
  saveUserProfile,
  lookupPincode,
} from '../services/dataStore';
import {
  CheckCircle2,
  MapPin,
  User,
  CreditCard,
  MessageSquare,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Truck,
} from 'lucide-react';
import Button from '../components/ui/Button';

const InputField = ({ label, name, type = 'text', required = true, value, onChange, placeholder, readOnly, ...props }) => (
  <div>
    <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      readOnly={readOnly}
      {...props}
      className={`w-full border rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all placeholder-slate-400 font-medium ${
        readOnly
          ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed'
          : 'bg-slate-50 border-slate-200 focus:bg-white'
      }`}
    />
  </div>
);

const buildUpiQrUrl = ({ upiId, payeeName, finalTotal }) => {
  if (!upiId?.trim()) return { qrUrl: '', upiUrl: '', error: 'UPI payment is unavailable because the admin has not configured a UPI ID.' };
  if (!Number.isFinite(finalTotal) || finalTotal <= 0) {
    return { qrUrl: '', upiUrl: '', error: 'Enter a valid delivery PIN code to calculate the final payable amount.' };
  }

  const upiUrl =
    `upi://pay?pa=${encodeURIComponent(upiId.trim())}` +
    `&pn=${encodeURIComponent(payeeName || '')}` +
    `&am=${finalTotal.toFixed(2)}` +
    '&cu=INR';

  return {
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`,
    upiUrl,
    error: '',
  };
};

// PIN status indicator component
const PinStatus = ({ status, state, district, charge, message }) => {
  if (status === 'idle') return null;

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <Loader2 size={13} className="animate-spin text-brand-gold" />
        <span>Checking delivery availability...</span>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle size={13} className="text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-700">Delivery available</span>
        </div>
        <p className="text-xs text-emerald-700 font-medium">
          {district && <><span className="font-bold">{district}</span>, </>}{state}
        </p>
        <p className="text-xs text-emerald-600 mt-0.5 font-semibold">
          <Truck size={11} className="inline mr-1" />
          Delivery Charge: ₹{charge}
        </p>
      </motion.div>
    );
  }

  if (status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700"
      >
        <AlertCircle size={13} className="shrink-0 mt-0.5 text-rose-500" />
        <span>{message}</span>
      </motion.div>
    );
  }

  return null;
};

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: '',
    transactionId: '',
    notes: ''
  });

  useEffect(() => {
    if (!user) return undefined;
    const timer = setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone?.replace(/[^0-9]/g, '').slice(-10) || '',
        email: prev.email || user.email || '',
      }));
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  // Shipping info derived from PIN lookup
  const [shippingInfo, setShippingInfo] = useState({
    status: 'idle',   // 'idle' | 'checking' | 'success' | 'error'
    state: '',
    district: '',
    postOffice: '',
    charge: null,
    message: '',
  });

  const pinTimerRef = useRef(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [saveAddress, setSaveAddress] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [upiLaunchMessage, setUpiLaunchMessage] = useState('');
  const [paymentSettings] = useState(() => getPaymentSettings());
  const storeSettings = getStoreSettings();

  useEffect(() => {
    let active = true;
    if (!user?.email) {
      return () => { active = false; };
    }
    getUserProfileAsync(user.email).then((profile) => {
      if (active) setSavedAddresses(profile?.addresses || []);
    });
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) navigate('/cart');
  }, [cartItems.length, navigate, orderPlaced]);

  if (cartItems.length === 0 && !orderPlaced) return null;

  const subtotal = getCartTotal();
  const visibleSavedAddresses = user ? savedAddresses : [];
  const shippingCharge = shippingInfo.status === 'success' ? shippingInfo.charge : null;
  const totalPayable = shippingCharge !== null ? subtotal + shippingCharge : null;
  const { qrUrl: dynamicQrUrl, upiUrl, error: qrError } = buildUpiQrUrl({
    upiId: paymentSettings.upiId,
    payeeName: storeSettings.businessName,
    finalTotal: totalPayable,
  });

  const handleProceedToPay = () => {
    if (!upiUrl) return;
    setUpiLaunchMessage('If no UPI app opens, use the QR code or continue below after completing payment in your UPI app.');
    window.location.href = upiUrl;
  };

  const handleSelectSavedAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      address: addr.street || prev.address,
      city: addr.city || prev.city,
      pincode: addr.pincode || prev.pincode
    }));
    if (addr.pincode && /^[0-9]{6}$/.test(addr.pincode)) {
      triggerPinLookup(addr.pincode);
    }
  };

  const triggerPinLookup = (pin) => {
    if (!/^[0-9]{6}$/.test(pin)) {
      setShippingInfo({ status: 'idle', state: '', district: '', postOffice: '', charge: null, message: '' });
      return;
    }
    setShippingInfo((prev) => ({ ...prev, status: 'checking', state: '', district: '', postOffice: '', charge: null, message: '' }));
    if (pinTimerRef.current) clearTimeout(pinTimerRef.current);
    pinTimerRef.current = setTimeout(async () => {
      const result = await lookupPincode(pin);
      if (result.valid) {
        setShippingInfo({
          status: 'success',
          state: result.state || '',
          district: result.district || '',
          postOffice: result.postOffice || '',
          charge: result.shippingCharge,
          message: '',
        });
      } else {
        setShippingInfo({
          status: 'error',
          state: '',
          district: '',
          postOffice: '',
          charge: null,
          message: result.error || 'Unable to look up this PIN code.',
        });
      }
    }, 500);
  };

  const formatWhatsappMessage = (customer, createdId, shipping) => {
    const lines = [
      `🥒 *NEW ORDER CONFIRMATION - ACHARRUCHI* 🥒`,
      `*Order ID:* #${createdId}`,
      `*Customer Name:* ${customer.name}`,
      `*Phone Number:* ${customer.phone}`,
      `*Delivery Address:* ${customer.address}, ${customer.city}`,
      `*District:* ${customer.district || shipping.district}`,
      `*State:* ${customer.state || shipping.state}`,
      `*PIN Code:* ${customer.pincode}`,
      `*Payment Method:* ${customer.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Digital Payment'}`,
      customer.paymentMethod === 'UPI' && customer.transactionId ? `*UPI Transaction ID / UTR:* ${customer.transactionId}` : '',
      '',
      `📦 *ORDERED ITEMS:*`
    ];

    cartItems.forEach((item) => {
      const itemTotal = (item.weightOption?.price || 0) * item.quantity;
      const variantLabel = item.weightOption?.label ?? item.weightOption?.weight ?? 'Unit';
      lines.push(`• *${item.product.name}* (Pack: ${variantLabel}) × ${item.quantity} — ₹${item.weightOption?.price || 0} each, Total ₹${itemTotal}`);
    });

    lines.push('');
    lines.push(`🛒 *Items Subtotal:* ₹${subtotal}`);
    lines.push(`🚚 *Delivery Charge:* ₹${shipping.charge}`);
    lines.push(`💰 *TOTAL AMOUNT:* ₹${subtotal + shipping.charge}`);
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
    // Trigger PIN lookup when pincode field changes
    if (name === 'pincode') {
      const cleaned = value.replace(/\D/g, '');
      if (/^[0-9]{6}$/.test(cleaned)) {
        triggerPinLookup(cleaned);
      } else {
        setShippingInfo({ status: 'idle', state: '', district: '', postOffice: '', charge: null, message: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'phone', 'address', 'pincode'];
    const missingFields = requiredFields.filter((field) => !formData[field].trim());

    if (missingFields.length > 0) {
      setErrorMessage('Please fill in all required delivery address fields.');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (shippingInfo.status !== 'success') {
      setErrorMessage('Please enter a valid 6-digit PIN code to determine the delivery charge.');
      return;
    }

    if (formData.paymentMethod === 'UPI' && !formData.transactionId.trim()) {
      setErrorMessage('UPI Transaction ID / UTR Reference Number is MANDATORY for UPI payments.');
      return;
    }

    if (!formData.paymentMethod) {
      setErrorMessage('Please select a payment method.');
      return;
    }

    setErrorMessage('');

    const newOrder = {
      customer: {
        ...formData,
        transactionId: formData.paymentMethod === 'UPI' ? formData.transactionId.trim() : '',
        state: shippingInfo.state,
        district: shippingInfo.district,
        postOffice: shippingInfo.postOffice,
        shippingCharge: shippingInfo.charge,
        itemsSubtotal: subtotal,
      },
      items: cartItems,
      totalAmount: subtotal + shippingInfo.charge,
      paymentMethod: formData.paymentMethod,
      date: new Date().toISOString()
    };

    if (user?.email && saveAddress) {
      const existingProfile = getUserProfile(user.email);
      const address = {
        id: Date.now().toString(),
        label: 'Home',
        name: formData.name,
        phone: formData.phone,
        street: formData.address,
        city: formData.city,
        state: shippingInfo.state,
        pincode: formData.pincode,
      };
      const existingAddresses = existingProfile.addresses || [];
      const nextAddresses = [
        ...existingAddresses.filter((item) => item.street !== address.street || item.pincode !== address.pincode),
        address,
      ];
      saveUserProfile(user.email, { addresses: nextAddresses });
    }

    let createdOrder;
    try {
      createdOrder = await saveOrder(newOrder);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to place your order right now.');
      return;
    }

    const createdId = createdOrder.id;
    const verifiedShipping = {
      state: createdOrder.customer?.state || shippingInfo.state,
      district: createdOrder.customer?.district || shippingInfo.district,
      charge: createdOrder.customer?.shippingCharge ?? shippingInfo.charge,
    };

    // Generate WhatsApp direct URL
    const rawPhone = storeSettings.whatsappNumber || '918885473903';
    const targetPhone = rawPhone.replace(/[^0-9]/g, '');
    const messageText = formatWhatsappMessage(
      { ...formData, state: verifiedShipping.state, district: verifiedShipping.district },
      createdId,
      verifiedShipping
    );
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;

    setWhatsappUrl(url);
    setOrderId(createdId);
    clearCart();
    setOrderPlaced(true);

    // Direct launch WhatsApp immediately
    try {
      window.location.href = url;
    } catch {
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
            <div className="bg-brand-matte p-5 rounded-3xl border border-white/10 text-sm text-slate-700">
              {user ? (
                <p><strong>Signed in:</strong> saved addresses are available below. You can still enter a different address.</p>
              ) : (
                <p><strong>Guest checkout:</strong> enter your delivery details below. <button type="button" onClick={() => navigate('/login', { state: { from: { pathname: '/checkout' } } })} className="font-bold text-brand-gold hover:underline">Login to use a saved address</button></p>
              )}
            </div>
            {/* Quick Saved Address Autofill */}
            {visibleSavedAddresses.length > 0 && (
              <div className="bg-brand-matte p-6 rounded-3xl border border-white/10">
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-gold mb-3 flex items-center gap-2">
                  <MapPin size={16} /> Quick Select Saved Delivery Address:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visibleSavedAddresses.map((addr) => (
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
                    {user && (
                      <label className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-600">
                        <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="accent-brand-gold" />
                        Save this address for future orders
                      </label>
                    )}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="City / Town"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Hyderabad"
                      required={false}
                    />
                    {/* PIN Code — triggers auto-lookup */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1.5">
                        PIN Code * <span className="normal-case font-normal text-slate-400">(auto-detects location)</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="533101"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        id="checkout-pincode"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all placeholder-slate-400 font-medium"
                      />
                      {/* PIN Status */}
                      <PinStatus
                        status={shippingInfo.status}
                        state={shippingInfo.state}
                        district={shippingInfo.district}
                        charge={shippingInfo.charge}
                        message={shippingInfo.message}
                      />
                    </div>
                  </div>

                  {/* Auto-detected State & District — read only */}
                  {shippingInfo.status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
                          District <span className="text-emerald-600 font-bold">(Auto-detected)</span>
                        </label>
                        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                          {shippingInfo.district || '—'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
                          State <span className="text-emerald-600 font-bold">(Auto-detected)</span>
                        </label>
                        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                          {shippingInfo.state || '—'}
                        </div>
                      </div>
                    </motion.div>
                  )}
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
                    {qrError ? (
                      <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {qrError}
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-800 mb-3">
                          Scan QR Code to pay <strong className="text-brand-gold text-sm">₹{totalPayable.toFixed(2)}</strong>:
                        </p>
                        <div className="w-44 h-44 bg-white mx-auto p-2 rounded-2xl border border-amber-300 shadow-sm mb-3">
                          <img
                            src={dynamicQrUrl}
                            alt="UPI QR Code"
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                        <p className="text-xs font-mono font-bold text-slate-700">UPI ID: {paymentSettings.upiId}</p>
                        <p className="text-[11px] text-slate-500 mt-1 mb-3">Accepts GPay, PhonePe, Paytm, BHIM</p>
                        <button
                          type="button"
                          onClick={handleProceedToPay}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Proceed to Pay
                        </button>
                        {upiLaunchMessage && (
                          <p className="text-[11px] text-slate-500 mt-2">{upiLaunchMessage}</p>
                        )}
                      </>
                    )}

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
                        {item.product.quantityType || 'Weight'}: {item.weightOption?.label ?? item.weightOption?.weight ?? 'Unit'} × {item.quantity}
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
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 items-center">
                  <span className="flex items-center gap-1"><Truck size={11} /> Delivery Charge</span>
                  <span className={`font-bold ${shippingCharge === null ? 'text-slate-400 italic' : 'text-slate-900'}`}>
                    {shippingInfo.status === 'checking' ? (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Loader2 size={10} className="animate-spin" /> Checking...
                      </span>
                    ) : shippingCharge !== null ? (
                      `₹${shippingCharge}`
                    ) : (
                      <span className="text-slate-400">Enter PIN code</span>
                    )}
                  </span>
                </div>
                {shippingInfo.status === 'success' && (
                  <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                    <CheckCircle size={10} />
                    {shippingInfo.district}, {shippingInfo.state}
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className={`font-mono ${totalPayable !== null ? 'text-brand-green' : 'text-slate-400'}`}>
                    {totalPayable !== null ? `₹${totalPayable}` : '—'}
                  </span>
                </div>
                {totalPayable === null && (
                  <p className="text-[10px] text-slate-400 text-center">
                    Enter PIN code above to see delivery charge &amp; final total
                  </p>
                )}
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={shippingInfo.status === 'checking'}
                className="py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Place Order &amp; Launch WhatsApp
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
