import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  getOrders,
  getUserProfile,
  saveUserProfile,
  getWishlist,
  toggleWishlist,
  getProducts,
  getStoreSettings
} from '../services/dataStore';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  MessageSquare,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import Button from '../components/ui/Button';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders] = useState(() => {
    if (!user) return [];
    return getOrders().filter(
      (o) => o.customer?.email?.toLowerCase() === user.email?.toLowerCase() || !o.customer?.email
    ).reverse();
  });
  const [userProfile, setUserProfileState] = useState(() => (user ? getUserProfile(user.email) : {
    name: '',
    email: '',
    phone: '',
    addresses: [],
    wishlist: []
  }));
  const [wishlistProducts, setWishlistProducts] = useState([]);
  
  // Profile edit states
  const [editName, setEditName] = useState(() => user?.name || '');
  const [editPhone, setEditPhone] = useState(() => user?.phone || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // New Address modal/form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: '',
    label: 'Home',
    name: '',
    phone: '',
    street: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    landmark: ''
  });

  const storeSettings = getStoreSettings();

  const loadWishlist = async (email) => {
    const ids = getWishlist(email);
    const allProds = await getProducts();
    const wishProds = allProds.filter((p) => ids.includes(p.id));
    setWishlistProducts(wishProds);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const ids = getWishlist(user.email);
    getProducts().then((allProds) => {
      setWishlistProducts(allProds.filter((p) => ids.includes(p.id)));
    });
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...userProfile,
      name: editName,
      phone: editPhone
    };
    saveUserProfile(user.email, updated);
    setUserProfileState(updated);
    setProfileSuccessMsg('Profile updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode) return;

    const addressItem = {
      ...newAddress,
      id: Date.now().toString(),
      name: newAddress.name || editName || user.name
    };

    const updatedAddresses = [...(userProfile.addresses || []), addressItem];
    const updatedProfile = { ...userProfile, addresses: updatedAddresses };
    saveUserProfile(user.email, updatedProfile);
    setUserProfileState(updatedProfile);

    // Reset form
    setNewAddress({
      id: '',
      label: 'Home',
      name: '',
      phone: '',
      street: '',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '',
      landmark: ''
    });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (addressId) => {
    const updatedAddresses = userProfile.addresses.filter((a) => a.id !== addressId);
    const updatedProfile = { ...userProfile, addresses: updatedAddresses };
    saveUserProfile(user.email, updatedProfile);
    setUserProfileState(updatedProfile);
  };

  const handleRemoveFromWishlist = (productId) => {
    toggleWishlist(user.email, productId);
    loadWishlist(user.email);
  };

  const handleWhatsAppOrderInquiry = (order) => {
    const text = `Hi Vasuki Pickles! I am inquiring about my Order ID: *${order.id}* placed on ${new Date(order.date).toLocaleDateString()}. Status is currently: *${order.status}*.`;
    const encoded = encodeURIComponent(text);
    const phone = storeSettings.whatsappNumber || '918885473903';
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex-grow bg-brand-black py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-brand-green to-slate-900 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold text-2xl font-bold font-serif shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#FFD700] font-extrabold mb-1">Welcome back,</p>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FFD700] tracking-wide">{userProfile.name || user.name}</h1>
              <p className="text-sm text-[#F8F3E8]/85 mt-0.5">{user.email} {userProfile.phone && `• ${userProfile.phone}`}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/flavours">
              <Button variant="primary" className="text-xs md:text-sm px-5 py-2.5 flex items-center gap-2">
                <ShoppingBag size={16} /> Explore Pickles
              </Button>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-2"
              title="Logout"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Navigation Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="glass-panel rounded-3xl p-4 border border-white/10 sticky top-28 space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-brand-gold text-brand-black shadow-md shadow-brand-gold/20'
                    : 'text-brand-cream/70 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={18} /> My Orders
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/10 font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'wishlist'
                    ? 'bg-brand-gold text-brand-black shadow-md shadow-brand-gold/20'
                    : 'text-brand-cream/70 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart size={18} /> Saved Pickles
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/10 font-bold">
                  {wishlistProducts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-brand-gold text-brand-black shadow-md shadow-brand-gold/20'
                    : 'text-brand-cream/70 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} /> Profile Details
                </div>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-brand-gold text-brand-black shadow-md shadow-brand-gold/20'
                    : 'text-brand-cream/70 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} /> Shipping Addresses
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/10 font-bold">
                  {userProfile.addresses?.length || 0}
                </span>
              </button>
            </div>
          </div>

          {/* Right Tab Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="glass-panel rounded-3xl border border-white/10 p-6 md:p-8 min-h-[550px]"
              >
                {/* TAB 1: ORDERS */}
                {activeTab === 'orders' && (
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-brand-cream">Order History & Tracking</h2>
                        <p className="text-sm text-brand-cream/50">Track your pickle shipments and review past purchases</p>
                      </div>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-16 px-4">
                        <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-gold">
                          <Package size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No orders placed yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                          Ready to experience authentic handmade Andhra pickles? Browse our top flavors now.
                        </p>
                        <Link to="/flavours">
                          <Button variant="primary" className="px-8 py-3">
                            Browse All Flavours
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                          >
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                              <div>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Order ID</span>
                                <p className="font-mono font-bold text-slate-900 text-base md:text-lg">{order.id}</p>
                              </div>

                              <div>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Placed On</span>
                                <p className="text-slate-700 text-sm font-medium">
                                  {new Date(order.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>

                              <div>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Amount</span>
                                <p className="text-brand-green font-bold text-base md:text-lg">₹{order.totalAmount}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    order.status === 'Delivered'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : order.status === 'Cancelled'
                                      ? 'bg-red-100 text-red-800 border border-red-300'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                                  }`}
                                >
                                  {order.status || 'Order Placed'}
                                </span>
                              </div>
                            </div>

                            {/* Tracking Timeline Stepper */}
                            <div className="py-5 border-b border-slate-200">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Order Status Stepper</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                  { title: 'Order Placed', icon: Clock, done: true },
                                  { title: 'Payment Verified', icon: ShieldCheck, done: order.paymentStatus === 'Paid' || order.paymentMethod === 'COD' },
                                  { title: 'Packed', icon: Package, done: order.status === 'Packed' || order.status === 'Dispatched' || order.status === 'Delivered' },
                                  { title: 'Delivered', icon: Truck, done: order.status === 'Delivered' }
                                ].map((step, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                                      step.done
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                        : 'bg-slate-100/70 border-slate-200 text-slate-400'
                                    }`}
                                  >
                                    <step.icon size={16} className={step.done ? 'text-emerald-600' : 'text-slate-400'} />
                                    <span>{step.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Items List */}
                            <div className="py-4 space-y-3">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                                    />
                                    <div>
                                      <h4 className="text-sm font-bold text-slate-900">{item.product.name}</h4>
                                      <p className="text-xs text-slate-500">
                                        Weight: <span className="font-semibold text-slate-700">{item.weightOption?.weight}</span> × {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm font-bold text-slate-900">
                                    ₹{(item.weightOption?.price || 0) * item.quantity}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Order Footer & Actions */}
                            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                              <p className="text-xs text-slate-500">
                                Delivery Address: <span className="font-medium text-slate-700">{order.customer?.address}, {order.customer?.city}</span>
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleWhatsAppOrderInquiry(order)}
                                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-emerald-200"
                                >
                                  <MessageSquare size={14} /> Order Support
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: WISHLIST / SAVED PICKLES */}
                {activeTab === 'wishlist' && (
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Saved Pickles & Favorites</h2>
                        <p className="text-sm text-slate-500">Quickly add your saved handcrafted items to cart</p>
                      </div>
                    </div>

                    {wishlistProducts.length === 0 ? (
                      <div className="text-center py-16 px-4">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                          <Heart size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                          Explore our collection and click the heart icon on any pickle jar to save it here!
                        </p>
                        <Link to="/flavours">
                          <Button variant="primary" className="px-8 py-3">
                            Explore Pickles
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="border border-slate-200 rounded-2xl p-4 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative h-44 rounded-xl overflow-hidden mb-3">
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => handleRemoveFromWishlist(prod.id)}
                                  className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-white transition-colors shadow-sm"
                                  title="Remove from wishlist"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <span className="text-xs uppercase tracking-wider font-semibold text-brand-gold">
                                {prod.productType}
                              </span>
                              <h3 className="text-base font-serif font-bold text-slate-900 line-clamp-1">{prod.name}</h3>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div>
                                <span className="text-xs text-slate-400">Starts at</span>
                                <p className="text-base font-bold text-brand-green">₹{prod.weights?.[0]?.price}</p>
                              </div>
                              <Link to={`/product/${prod.id}`}>
                                <Button variant="primary" className="px-4 py-2 text-xs flex items-center gap-1">
                                  View Item <ArrowRight size={14} />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: PROFILE DETAILS */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Personal Information</h2>
                        <p className="text-sm text-slate-500">Update your contact details for faster checkout</p>
                      </div>
                    </div>

                    {profileSuccessMsg && (
                      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 size={18} /> {profileSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-600 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-gold text-slate-900 text-sm"
                          placeholder="Your Name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-600 mb-2">
                          Email Address (Read only)
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-600 mb-2">
                          Mobile Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-gold text-slate-900 text-sm"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <Button type="submit" variant="primary" className="px-8 py-3 text-sm">
                        Save Profile Changes
                      </Button>
                    </form>
                  </div>
                )}

                {/* TAB 4: SHIPPING ADDRESSES */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Saved Delivery Addresses</h2>
                        <p className="text-sm text-slate-500">Manage addresses for 1-click delivery setup</p>
                      </div>
                      <Button
                        variant="primary"
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="text-xs px-4 py-2 flex items-center gap-1.5"
                      >
                        <Plus size={16} /> Add New Address
                      </Button>
                    </div>

                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                        <h3 className="text-base font-bold text-slate-900 mb-2">New Address Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1 font-semibold">Address Tag</label>
                            <select
                              value={newAddress.label}
                              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                            >
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1 font-semibold">Recipient Contact Phone</label>
                            <input
                              type="tel"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                              placeholder="+91 9876543210"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-500 mb-1 font-semibold">Street / Flat / House No / Area</label>
                          <input
                            type="text"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                            placeholder="Flat No 402, Sunshine Apartments, Jubilee Hills"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1 font-semibold">City</label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1 font-semibold">State</label>
                            <input
                              type="text"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1 font-semibold">Pincode</label>
                            <input
                              type="text"
                              value={newAddress.pincode}
                              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                              placeholder="500033"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <Button type="submit" variant="primary" className="px-6 py-2 text-xs">
                            Save Address
                          </Button>
                        </div>
                      </form>
                    )}

                    {(!userProfile.addresses || userProfile.addresses.length === 0) ? (
                      <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                          <MapPin size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No saved addresses</h3>
                        <p className="text-slate-500 text-sm mb-4">Add your shipping address for fast express checkout.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.addresses.map((addr) => (
                          <div key={addr.id} className="p-5 rounded-2xl border border-slate-200 bg-white relative hover:shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-3 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-xs">
                                {addr.label}
                              </span>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Delete address"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="font-bold text-slate-900 text-sm">{addr.name || user.name}</p>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">{addr.street}</p>
                            <p className="text-slate-600 text-xs">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            {addr.phone && <p className="text-xs text-slate-400 mt-2">Ph: {addr.phone}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
