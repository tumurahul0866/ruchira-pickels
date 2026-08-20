import { resolveApiUrl } from './apiConfig';

export const initialProductTypes = [
  'Pickles',
  'Podis',
  'Non-Veg Pickles',
  'Sweets & Snacks'
];

export const initialProducts = []; /* Legacy demo product fixture removed.
  {
    id: '1',
    name: 'Andhra Avakaya Mango Pickle',
    category: 'Veg',
    productType: 'Pickles',
    weights: [
      { weight: '250g', price: 180 },
      { weight: '500g', price: 340 },
      { weight: '1 kg', price: 620 }
    ],
    spiceLevel: 'Spicy',
    description: 'Authentic Andhra style raw mango pickle crafted with premium cold-pressed groundnut oil, Guntur red chilies, and hand-ground spices.',
    ingredients: 'Raw mango chunks, cold-pressed groundnut oil, Guntur chili powder, mustard powder, fenugreek, garlic, sea salt',
    shelfLife: '12 Months',
    discountPrice: 0,
    bulkPrice: 1700,
    stockQuantity: 45,
    inStock: true,
    bestSeller: true,
    newArrival: false,
    visible: true,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '2',
    name: 'Gongura Garlic Pickle',
    category: 'Veg',
    productType: 'Pickles',
    weights: [
      { weight: '250g', price: 190 },
      { weight: '500g', price: 360 },
      { weight: '1 kg', price: 650 }
    ],
    spiceLevel: 'Extra Hot',
    description: 'Iconic Andhra sour sorrel leaves (Gongura) blended with roasted garlic cloves and roasted red chilies. A true staple of Telugu cuisine.',
    ingredients: 'Fresh Gongura leaves, whole garlic, Guntur chilies, mustard oil, coriander seeds, cumin, salt',
    shelfLife: '9 Months',
    discountPrice: 0,
    bulkPrice: 1800,
    stockQuantity: 32,
    inStock: true,
    bestSeller: true,
    newArrival: false,
    visible: true,
    rating: 4.8,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '3',
    name: 'Boneless Chicken Pickle',
    category: 'Non-Veg',
    productType: 'Non-Veg Pickles',
    weights: [
      { weight: '250g', price: 380 },
      { weight: '500g', price: 690 },
      { weight: '1 kg', price: 1290 }
    ],
    spiceLevel: 'Spicy',
    description: 'Tender boneless chicken pieces fried to golden perfection, marinated in rich aromatic gravy with freshly roasted whole spices.',
    ingredients: 'Boneless chicken, groundnut oil, ginger garlic paste, chili powder, lemon juice, garam masala, salt',
    shelfLife: '4 Months (Refrigeration recommended)',
    discountPrice: 0,
    bulkPrice: 3500,
    stockQuantity: 28,
    inStock: true,
    bestSeller: true,
    newArrival: true,
    visible: true,
    rating: 5.0,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '4',
    name: 'Spicy Royal Prawns Pickle',
    category: 'Non-Veg',
    productType: 'Non-Veg Pickles',
    weights: [
      { weight: '250g', price: 440 },
      { weight: '500g', price: 820 },
      { weight: '1 kg', price: 1550 }
    ],
    spiceLevel: 'Spicy',
    description: 'Juicy coastal sea prawns cooked in spicy Andhra tangy gravy. Packed with intense ocean flavor and traditional spices.',
    ingredients: 'Fresh sea prawns, groundnut oil, chili powder, ginger, garlic, cloves, cinnamon, lemon concentrate',
    shelfLife: '4 Months (Refrigerated)',
    discountPrice: 0,
    bulkPrice: 4200,
    stockQuantity: 20,
    inStock: true,
    bestSeller: false,
    newArrival: true,
    visible: true,
    rating: 4.9,
    reviewsCount: 82,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '5',
    name: 'Andhra Mutton Pickle',
    category: 'Non-Veg',
    productType: 'Non-Veg Pickles',
    weights: [
      { weight: '250g', price: 460 },
      { weight: '500g', price: 860 },
      { weight: '1 kg', price: 1650 }
    ],
    spiceLevel: 'Extra Hot',
    description: 'Tender boneless mutton pieces slow-cooked in cold-pressed oil and roasted spice blend. Rich, savory, and extremely delicious.',
    ingredients: 'Boneless tender mutton, groundnut oil, garlic, ginger, star anise, red chili powder, coriander, salt',
    shelfLife: '4 Months (Refrigerated)',
    discountPrice: 0,
    bulkPrice: 4500,
    stockQuantity: 15,
    inStock: true,
    bestSeller: true,
    newArrival: true,
    visible: true,
    rating: 4.9,
    reviewsCount: 71,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: []
  },
  {
    id: '6',
    name: 'Kandi Podi (Gunpowder)',
    category: 'Veg',
    productType: 'Podis',
    weights: [
      { weight: '250g', price: 140 },
      { weight: '500g', price: 260 },
      { weight: '1 kg', price: 490 }
    ],
    spiceLevel: 'Medium',
    description: 'Aromatic roasted toor dal powder blended with cumin seeds and red chilies. Perfectly pairs with hot rice and melted pure ghee.',
    ingredients: 'Roasted Toor Dal, Bengal Gram, Cumin seeds, Red chilies, Asafoetida, Salt',
    shelfLife: '9 Months',
    discountPrice: 0,
    bulkPrice: 1300,
    stockQuantity: 50,
    inStock: true,
    bestSeller: true,
    newArrival: false,
    visible: true,
    rating: 4.9,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: []
  },
  {
    id: '7',
    name: 'Karivepaku (Curry Leaf) Podi',
    category: 'Veg',
    productType: 'Podis',
    weights: [
      { weight: '250g', price: 150 },
      { weight: '500g', price: 280 },
      { weight: '1 kg', price: 520 }
    ],
    spiceLevel: 'Mild',
    description: 'Nutritious curry leaf powder enriched with iron and antioxidants. Roasted with black gram, garlic, and cumin.',
    ingredients: 'Fresh sun-dried curry leaves, Urad dal, Chana dal, Garlic, Pepper, Cumin, Tamarind, Salt',
    shelfLife: '9 Months',
    discountPrice: 0,
    bulkPrice: 1400,
    stockQuantity: 40,
    inStock: true,
    bestSeller: false,
    newArrival: true,
    visible: true,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: []
  },
  {
    id: '8',
    name: 'Allam (Ginger) Sweet & Spicy Pickle',
    category: 'Veg',
    productType: 'Pickles',
    weights: [
      { weight: '250g', price: 170 },
      { weight: '500g', price: 320 },
      { weight: '1  kg', price: 600 }
    ],
    spiceLevel: 'Medium',
    description: 'Delicious sweet & tangy ginger pickle prepared with organic jaggery and tamarind. Essential condiment for MLA Pesarattu Dosa.',
    ingredients: 'Fresh ginger, organic jaggery, tamarind extract, red chilies, mustard seeds, fenugreek, oil, salt',
    shelfLife: '9 Months',
    discountPrice: 0,
    bulkPrice: 1600,
    stockQuantity: 30,
    inStock: true,
    bestSeller: false,
    newArrival: false,
    visible: true,
    rating: 4.7,
    reviewsCount: 53,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: []
  },
  {
    id: '9',
    name: 'Bellam Gavvalu (Jaggery Shells)',
    category: 'Veg',
    productType: 'Sweets & Snacks',
    weights: [
      { weight: '250g', price: 130 },
      { weight: '500g', price: 240 },
      { weight: '1kg', price: 450 }
    ],
    spiceLevel: 'Mild',
    description: 'Traditional crisp sweet shells rolled in pure cardamom-scented jaggery syrup. Crunchy, sweet, and nostalgic.',
    ingredients: 'Wheat flour, organic jaggery, cardamom powder, pure ghee, refined sunflower oil',
    shelfLife: '3 Months',
    discountPrice: 0,
    bulkPrice: 1200,
    stockQuantity: 35,
    inStock: true,
    bestSeller: true,
    newArrival: false,
    visible: true,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    additionalImages: []
  }
]; */

const initialReviews = [
  {
    id: 'r1',
    name: 'Srikanth Reddy (Hyderabad)',
    product: 'Gongura Garlic Pickle',
    rating: 5,
    date: '02 Aug 2026',
    text: 'The Gongura Garlic pickle tastes exactly like my grandmother used to make in Guntur! Perfect tanginess, bold garlic cloves, and genuine cold-pressed oil aroma. Superb leak-proof packaging.',
    visible: true,
    verifiedBuyer: true
  },
  {
    id: 'r2',
    name: 'Priyanka Sharma (Bengaluru)',
    product: 'Andhra Avakaya Mango Pickle',
    rating: 5,
    date: '31 Jul 2026',
    text: 'Living in Bangalore, I missed authentic Andhra Avakaya. Ordered the 500g jar from Vasuki Pickles and it exceeded my expectations. Spice level is spot on!',
    visible: true,
    verifiedBuyer: true
  },
  {
    id: 'r3',
    name: 'Ramesh Raju (Vijayawada)',
    product: 'Boneless Chicken Pickle',
    rating: 5,
    date: '27 Jul 2026',
    text: 'The Boneless Chicken pickle is unbelievable! Juicy, massive chicken pieces with authentic roasted spice gravy. Ordering 1kg jar for my office colleagues too.',
    visible: true,
    verifiedBuyer: true
  },
  {
    id: 'r4',
    name: 'Kavitha Rao (Chennai)',
    product: 'Kandi Podi (Gunpowder)',
    rating: 5,
    date: '22 Jul 2026',
    text: 'Kandi Podi with hot rice and homemade ghee is pure bliss. Fragrant toor dal aroma and perfectly balanced red chili heat. Highly recommended!',
    visible: true,
    verifiedBuyer: true
  }
];

const initialOffers = [
  {
    id: 'o1',
    code: 'KONASEMA10',
    title: 'Grand Konasema Welcome Offer',
    description: 'Enjoy 10% OFF on all orders above ₹999 + FREE Express Shipping across India!',
    discount: 10,
    active: true,
    minOrderValue: 999
  }
];

const defaultStoreSettings = {
  logoUrl: '/logo.svg',
  heroBackgroundUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  featureImageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  aboutImageUrl: 'https://images.unsplash.com/photo-1506544777-64cfb638973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  brandTagline: 'Handcrafted Heritage Pickles & Podis from Konasema Delta.',
  heroTitle: 'KONASEMA RUCHULU',
  heroSubtitle: 'Authentic Andhra & Konasema pickles made with cold-pressed oil and grandma recipes.',
  whatsappMessage: 'Hi Konasema Ruchulu! I would like to place an order.',
  whatsappNumber: '+918885473903',
  contactNumber: '+91 8885473903',
  email: 'support@konasemaruchulu.com',
  instagram: 'https://instagram.com/konasemaruchulu',
  facebook: 'https://facebook.com/konasemaruchulu',
  mapLink: 'https://maps.google.com',
  deliveryNote: 'Free Express shipping on all orders above ₹999.',
  aboutTitle: 'Preserving Authentic Konasema Pickling Traditions',
  aboutStory: 'Konasema Ruchulu is crafted with traditional heirloom recipes, farm-fresh ingredients, and bold regional flavors from the fertile Konasema delta. Every jar is prepared with care to bring rich homemade taste to every meal.',
  aboutStory2: 'What started as a family tradition has blossomed into a trusted brand dedicated to preserving the authentic culinary heritage of South India. We believe that a meal is incomplete without that perfect touch of spice, tanginess, and aromatic cold-pressed groundnut oil.',
  aboutReasonTitle: 'The Essence of Konasema',
  aboutReasonText: 'Symbolizes agricultural richness, warmth, and legendary culinary heritage. Like timeless recipes passed through generations, our pickles are bold, memorable, and packaged in food-grade glass jars and sealed pouches without chemical shortcuts.',
  aboutPromise1Title: '100% Natural Ingredients',
  aboutPromise1Desc: 'Sourced directly from local Andhra farmers to ensure authentic spice, color, and freshness in every jar.',
  aboutPromise2Title: 'Traditional Wood-Pressed Oil',
  aboutPromise2Desc: 'Slow-extracted groundnut oil retains wholesome aroma and natural health benefits without chemical refining.',
  aboutPromise3Title: 'Made with Love',
  aboutPromise3Desc: 'Hand-mixed in hygienic small batches with the same devotion and care as for our own family.',
  businessName: 'Konasema Ruchulu',
  address: '123 Heritage Spice Lane, Jubilee Hills, Hyderabad, Telangana 500033',
  freeShippingEnabled: true,
  minFreeShippingAmount: 999
};

const defaultPaymentSettings = {
  qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=konasemaruchulu@upi%26pn=Konasema%20Ruchulu%20Pickles',
  upiId: 'konasemaruchulu@upi',
  phone: '+91 8885473903',
  enableCOD: true,
  enableUPI: true,
  enableScanner: true,
  scannerNote: 'Scan the QR code using Google Pay, PhonePe, Paytm, or BHIM UPI to complete payment.',
  instructions: 'After paying, take a screenshot and enter your transaction UTR reference number.'
};

const defaultAdminProfile = {
  ownerName: 'Konasema Ruchulu Management',
  businessName: 'Konasema Ruchulu',
  email: 'ruchira@gmail.com',
  phone: '+91 8885473903',
  whatsapp: '+91 8885473903',
  address: 'Hyderabad, Telangana 500033',
  instagram: 'https://instagram.com/konasemaruchulu'
};

// Orders start empty and are populated only by the backend or a customer checkout.
const initialOrders = []; /* Legacy demo order fixture removed.
  {
    id: 'ORD884920',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    totalAmount: 960,
    trackingNumber: 'TRK772910',
    customer: {
      name: 'Srikanth Reddy',
      phone: '9885473903',
      email: 'srikanth@gmail.com',
      address: 'Flat 402, Sunshine Towers, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    items: [
      {
        product: initialProducts[0],
        weightOption: { weight: '500g', price: 340 },
        quantity: 1
      },
      {
        product: initialProducts[2],
        weightOption: { weight: '500g', price: 690 },
        quantity: 1
      }
    ]
  },
  {
    id: 'ORD884921',
    date: new Date().toISOString(),
    status: 'Order Placed',
    paymentStatus: 'Pending',
    paymentMethod: 'COD',
    totalAmount: 650,
    trackingNumber: 'TRK772911',
    customer: {
      name: 'Priyanka Sharma',
      phone: '9876543210',
      email: 'priyanka@gmail.com',
      address: 'House 12, Indiranagar 10th Main',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [
      {
        product: initialProducts[1],
        weightOption: { weight: '1kg', price: 650 },
        quantity: 1
      }
    ]
  }
]; */

const PRODUCTS_API = resolveApiUrl('/products');
const ORDERS_API = resolveApiUrl('/orders');
const REVIEWS_API = resolveApiUrl('/reviews');
const OFFERS_API = resolveApiUrl('/offers');
const STORE_SETTINGS_API = resolveApiUrl('/store-settings');
const PAYMENT_SETTINGS_API = resolveApiUrl('/payment-settings');
const ADMIN_PROFILE_API = resolveApiUrl('/admin-profile');
const PRODUCT_TYPES_API = resolveApiUrl('/product-types');
const USER_PROFILES_API = resolveApiUrl('/user-profiles');
const CUSTOMERS_API = resolveApiUrl('/customers');
const SHIPPING_RULES_API = resolveApiUrl('/shipping-rules');
const PINCODE_API_BASE = resolveApiUrl('/pincode');
let productsRequest = null;

const getApiHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vasuki_token') : null;
  const base = { 'Content-Type': 'application/json' };
  if (token) base['Authorization'] = `Bearer ${token}`;
  return base;
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, { headers: getApiHeaders(), ...options });
  if (response.status === 401) {
    try {
      // Notify app about auth expiry so AuthContext can logout
      window.dispatchEvent(new CustomEvent('vasuki:auth-expired'));
    } catch {
      // ignore
    }
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};

const backgroundFetch = async (url, updater) => {
  try {
    const data = await fetchJson(url);
    updater(data);
  } catch {
    // Ignore background sync failures
  }
};

const syncLocalProducts = (products) => {
  localStorage.setItem('vasuki_products', JSON.stringify(products));
};

const syncLocalOrders = (orders) => {
  localStorage.setItem('vasuki_orders', JSON.stringify(orders));
};

const syncLocalReviews = (reviews) => {
  localStorage.setItem('vasuki_reviews', JSON.stringify(reviews));
};

const syncLocalOffers = (offers) => {
  localStorage.setItem('vasuki_offers', JSON.stringify(offers));
};

const syncLocalStoreSettings = (settings) => {
  localStorage.setItem('vasuki_settings', JSON.stringify(settings));
};

const syncLocalPaymentSettings = (settings) => {
  localStorage.setItem('vasuki_payment_settings', JSON.stringify(settings));
};

const syncLocalAdminProfile = (profile) => {
  localStorage.setItem('vasuki_admin_profile', JSON.stringify(profile));
};

const syncLocalProductTypes = (types) => {
  localStorage.setItem('vasuki_product_types', JSON.stringify(types));
};

const syncLocalUserProfiles = (profiles) => {
  localStorage.setItem('vasuki_user_profiles', JSON.stringify(profiles));
};

const syncLocalCustomers = (customers) => {
  localStorage.setItem('vasuki_customers', JSON.stringify(customers));
};

const createProductPayload = (product) => ({
  ...product,
  name: product.name || '',
  category: product.category || 'Veg',
  productType: product.productType || 'Pickles',
  quantityType: product.quantityType || 'Weight',
  pricePerUnit: Number(product.pricePerUnit) || 0,
  // Support new `variants` shape while remaining backward compatible with `weights`.
  weights: Array.isArray(product.variants)
    ? product.variants.map((v) => ({ weight: v.label ?? v.weight, price: Number(v.price) || 0 }))
    : Array.isArray(product.weights)
    ? product.weights
    : [],
  spiceLevel: product.spiceLevel || 'Medium',
  description: product.description || '',
  ingredients: product.ingredients || '',
  shelfLife: product.shelfLife || '9 Months',
  discountPrice: Number(product.discountPrice) || 0,
  bulkPrice: Number(product.bulkPrice) || 0,
  stockQuantity: Number(product.stockQuantity) || 25,
  inStock: product.inStock !== undefined ? product.inStock : Number(product.stockQuantity) > 0,
  bestSeller: Boolean(product.bestSeller),
  newArrival: Boolean(product.newArrival),
  visible: product.visible !== undefined ? product.visible : true,
  rating: product.rating || 4.9,
  reviewsCount: product.reviewsCount || 10,
  image: product.image || '',
  additionalImages: Array.isArray(product.additionalImages) ? product.additionalImages : []
});

export const getProductUnitPrice = (product) => {
  if (typeof product.pricePerUnit === 'number' && product.pricePerUnit > 0) {
    return product.pricePerUnit;
  }
  if (Array.isArray(product.weights) && product.weights.length > 0) {
    return Number(product.weights[0].price) || 0;
  }
  return 0;
};

export const getProductUnitLabel = (product) => {
  return product.quantityType || 'Unit';
};

/**
 * Return a normalized list of variants for a product.
 * Each variant has the shape: { label: string, price: number }
 * Backwards-compatible with legacy `weights` which use { weight, price }.
 */
export const getProductVariants = (product) => {
  if (!product) return [];
  // Prefer explicit `variants` if provided
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.map((v) => ({ label: v.label ?? v.weight ?? String(v), price: Number(v.price) || 0 }));
  }

  // Fall back to legacy `weights` field
  if (Array.isArray(product.weights) && product.weights.length > 0) {
    return product.weights.map((w) => ({ label: w.weight ?? w.label ?? String(w), price: Number(w.price) || 0 }));
  }

  // Fallback single unit option built from pricePerUnit
  const unitLabel = getProductUnitLabel(product);
  const unitPrice = getProductUnitPrice(product);
  return [{ label: unitLabel, price: unitPrice }];
};

export const isLegacyProduct = (product) => {
  return Array.isArray(product.weights) && product.weights.length > 0 && !product.pricePerUnit;
};

const getProductsFromLocal = () => {
  const products = localStorage.getItem('vasuki_products');
  if (!products) {
    localStorage.setItem('vasuki_products', JSON.stringify([]));
    return [];
  }
  const parsed = JSON.parse(products);
  return parsed;
};

export const getProducts = async () => {
  if (!productsRequest) {
    productsRequest = fetchJson(PRODUCTS_API)
      .then((products) => {
        if (Array.isArray(products)) {
          syncLocalProducts(products);
          return products;
        }
        return [];
      })
      .catch(() => [])
      .finally(() => {
        productsRequest = null;
      });
  }
  return productsRequest;
};

export const saveProduct = async (product) => {
  const payload = createProductPayload(product);
  const method = payload.id ? 'PUT' : 'POST';
  const url = payload.id ? `${PRODUCTS_API}/${payload.id}` : PRODUCTS_API;

  try {
    const response = await fetch(url, {
      method,
      headers: getApiHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      let message = 'Failed to save product';
      try {
        const parsed = JSON.parse(errorPayload);
        message = parsed.error || parsed.message || message;
      } catch {
        if (errorPayload) message = errorPayload;
      }
      throw new Error(message || `HTTP ${response.status}`);
    }

    const updated = await response.json();
    const products = getProductsFromLocal();
    const existingIndex = products.findIndex((item) => item.id === updated.id);
    if (existingIndex >= 0) {
      products[existingIndex] = updated;
    } else {
      products.push(updated);
    }
    syncLocalProducts(products);
    return updated;
  } catch (error) {
    console.error('saveProduct error:', error);
    throw error;
  }
};

export const getProductTypes = () => {
  const types = localStorage.getItem('vasuki_product_types');
  if (!types) {
    localStorage.setItem('vasuki_product_types', JSON.stringify(initialProductTypes));
    backgroundFetch(PRODUCT_TYPES_API, syncLocalProductTypes);
    return initialProductTypes;
  }
  const parsed = JSON.parse(types);
  backgroundFetch(PRODUCT_TYPES_API, syncLocalProductTypes);
  return parsed;
};

export const addProductType = (type) => {
  const types = getProductTypes();
  if (!types.includes(type)) {
    const nextTypes = [...types, type];
    localStorage.setItem('vasuki_product_types', JSON.stringify(nextTypes));
    fetch(PRODUCT_TYPES_API, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(nextTypes),
    }).catch(() => {
      // continue on local fallback
    });
  }
};

export const deleteProduct = async (id) => {
  const normalizedId = String(id);
  const response = await fetch(`${PRODUCTS_API}/${normalizedId}`, {
    method: 'DELETE',
    headers: getApiHeaders(),
  });
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    let message = `HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody);
      message = parsed.error || parsed.message || message;
    } catch {
      if (errorBody) message = errorBody;
    }
    throw new Error(message);
  }

  const localProducts = getProductsFromLocal().filter((p) => String(p.id) !== normalizedId);
  syncLocalProducts(localProducts);
  return true;
};

export const toggleProductVisibility = async (id) => {
  const products = await getProducts();
  const target = products.find((p) => p.id === id);
  if (!target) return false;
  const updatedProduct = { ...target, visible: !target.visible };
  await saveProduct(updatedProduct);
  return true;
};

export const updateProductStock = async (id, quantity) => {
  const products = await getProducts();
  const target = products.find((p) => p.id === id);
  if (!target) return false;
  const updatedProduct = {
    ...target,
    stockQuantity: Number(quantity),
    inStock: Number(quantity) > 0,
  };
  await saveProduct(updatedProduct);
  return true;
};

// --- ORDERS DATABASE & TRACKING ---

const getOrdersFromLocal = () => {
  const orders = localStorage.getItem('vasuki_orders');
  if (!orders) {
    localStorage.setItem('vasuki_orders', JSON.stringify(initialOrders));
    backgroundFetch(ORDERS_API, syncLocalOrders);
    return initialOrders;
  }
  const parsed = JSON.parse(orders);
  backgroundFetch(ORDERS_API, syncLocalOrders);
  return parsed;
};

export const getOrders = async () => {
  try {
    const orders = await fetchJson(ORDERS_API);
    if (Array.isArray(orders) && orders.length > 0) {
      syncLocalOrders(orders);
      return orders;
    }
  } catch {
    // Fall back to the locally cached orders if the backend is unavailable.
  }
  return getOrdersFromLocal();
};

export const saveOrder = async (order) => {
  const orders = getOrdersFromLocal();
  const trackingNumber = 'TRK' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    ...order,
    id: order.id || 'ORD' + Date.now().toString().slice(-6),
    trackingNumber,
    date: order.date || new Date().toISOString(),
    status: order.status || 'Order Placed',
    paymentStatus: order.paymentStatus || 'Pending',
  };
  const nextOrders = [newOrder, ...orders];
  syncLocalOrders(nextOrders);

  try {
    const response = await fetch(ORDERS_API, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(newOrder),
    });

    if (response.ok) {
      const savedOrder = await response.json();
      const mergedOrders = [savedOrder, ...orders.filter((o) => o.id !== savedOrder.id)];
      syncLocalOrders(mergedOrders);
      return savedOrder;
    }

    const errorPayload = await response.text();
    let message = 'Failed to save order';
    try {
      const parsed = JSON.parse(errorPayload);
      message = parsed.error || parsed.message || message;
    } catch {
      if (errorPayload) message = errorPayload;
    }
    throw new Error(message || `HTTP ${response.status}`);
  } catch (error) {
    console.error('saveOrder error:', error);
    return newOrder;
  }
};

export const updateOrderStatus = (id, status, paymentStatus) => {
  const orders = getOrdersFromLocal();
  const index = orders.findIndex((o) => o.id === id);
  if (index >= 0) {
    if (status) orders[index].status = status;
    if (paymentStatus) orders[index].paymentStatus = paymentStatus;
    syncLocalOrders(orders);
    fetch(`${ORDERS_API}/${id}`, {
      method: 'PUT',
      headers: getApiHeaders(),
      body: JSON.stringify({ status, paymentStatus }),
    }).catch(() => {
      // ignore backend failure
    });
  }
};

export const deleteOrder = async (id) => {
  const orders = getOrdersFromLocal().filter((o) => o.id !== id);
  syncLocalOrders(orders);
  try {
    const response = await fetch(`${ORDERS_API}/${id}`, {
      method: 'DELETE',
      headers: getApiHeaders(),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(errText || `HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('deleteOrder failed:', error);
    // Re-throw so the UI can handle gracefully
    throw error;
  }
};

// --- REVIEWS DATABASE ---

const getReviewsFromLocal = () => {
  const reviews = localStorage.getItem('vasuki_reviews');
  if (!reviews) {
    localStorage.setItem('vasuki_reviews', JSON.stringify(initialReviews));
    backgroundFetch(REVIEWS_API, syncLocalReviews);
    return initialReviews;
  }
  const parsed = JSON.parse(reviews);
  backgroundFetch(REVIEWS_API, syncLocalReviews);
  return parsed;
};

export const getReviews = () => getReviewsFromLocal();

export const saveReview = (review) => {
  const reviews = getReviewsFromLocal();
  const normalized = {
    id: review.id || Date.now().toString(),
    name: review.name || 'Valued Customer',
    product: review.product || 'Vasuki Pickle',
    rating: Number(review.rating) || 5,
    date: review.date || new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    text: review.text || '',
    visible: review.visible !== undefined ? review.visible : true,
    verifiedBuyer: review.verifiedBuyer !== undefined ? review.verifiedBuyer : true,
  };
  const existingIndex = reviews.findIndex((item) => item.id === normalized.id);
  const nextReviews = existingIndex >= 0 ? [...reviews] : [normalized, ...reviews];
  if (existingIndex >= 0) {
    nextReviews[existingIndex] = normalized;
  }
  syncLocalReviews(nextReviews);

  const method = normalized.id && existingIndex >= 0 ? 'PUT' : 'POST';
  const url = normalized.id && existingIndex >= 0 ? `${REVIEWS_API}/${normalized.id}` : REVIEWS_API;

  // Attach user metadata if present
  try {
    const storedUser = localStorage.getItem('vasuki_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      normalized.user_id = normalized.user_id || u.id;
      normalized.user_email = normalized.user_email || u.email;
      normalized.user_name = normalized.user_name || u.name;
    }
  } catch {
    // ignore
  }

  fetch(url, {
    method,
    headers: getApiHeaders(),
    body: JSON.stringify({ ...normalized }),
  }).catch(() => {
    // offline fallback
  });
  return normalized;
};

export const deleteReview = (id) => {
  const reviews = getReviewsFromLocal().filter((r) => r.id !== id);
  syncLocalReviews(reviews);
  fetch(`${REVIEWS_API}/${id}`, {
    method: 'DELETE',
    headers: getApiHeaders(),
  }).catch(() => {
    // ignore
  });
};

export const toggleReviewVisibility = (id) => {
  const reviews = getReviewsFromLocal();
  const target = reviews.find((r) => r.id === id);
  if (target) {
    target.visible = !target.visible;
    syncLocalReviews(reviews);
    fetch(`${REVIEWS_API}/${id}`, {
      method: 'PUT',
      headers: getApiHeaders(),
      body: JSON.stringify({ visible: target.visible }),
    }).catch(() => {
      // ignore
    });
  }
};

// --- OFFERS DATABASE ---

const getOffersFromLocal = () => {
  const offers = localStorage.getItem('vasuki_offers');
  if (!offers) {
    localStorage.setItem('vasuki_offers', JSON.stringify(initialOffers));
    backgroundFetch(OFFERS_API, syncLocalOffers);
    return initialOffers;
  }
  const parsed = JSON.parse(offers);
  backgroundFetch(OFFERS_API, syncLocalOffers);
  return parsed;
};

export const getOffers = () => getOffersFromLocal();

export const saveOffer = (offer) => {
  const offers = getOffersFromLocal();
  const normalized = {
    id: offer.id || Date.now().toString(),
    code: (offer.code || 'SALE10').toUpperCase().trim(),
    title: offer.title || '',
    description: offer.description || '',
    discount: Number(offer.discount) || 0,
    active: offer.active !== undefined ? offer.active : true,
    productId: offer.productId || '',
    minOrderValue: Number(offer.minOrderValue) || 0,
  };
  const index = offers.findIndex((o) => o.id === normalized.id);
  const nextOffers = [...offers];
  if (index >= 0) {
    nextOffers[index] = normalized;
  } else {
    nextOffers.push(normalized);
  }
  syncLocalOffers(nextOffers);

  const method = index >= 0 ? 'PUT' : 'POST';
  const url = index >= 0 ? `${OFFERS_API}/${normalized.id}` : OFFERS_API;

  fetch(url, {
    method,
    headers: getApiHeaders(),
    body: JSON.stringify(normalized),
  }).catch(() => {
    // offline fallback
  });
  return normalized;
};

export const deleteOffer = async (id) => {
  const offers = getOffersFromLocal().filter((o) => o.id !== id);
  syncLocalOffers(offers);
  try {
    const response = await fetch(`${OFFERS_API}/${id}`, {
      method: 'DELETE',
      headers: getApiHeaders(),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(errText || `HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('deleteOffer failed:', error);
    throw error;
  }
};

export const toggleOffer = async (id) => {
  const offers = getOffersFromLocal();
  const target = offers.find((o) => o.id === id);
  if (!target) return;
  target.active = !target.active;
  syncLocalOffers(offers);
  // Backend only has POST /api/offers (upsert) — no PUT /api/offers/:id route exists.
  // Use POST which correctly persists active state to the database.
  try {
    const response = await fetch(OFFERS_API, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(target),
    });
    if (!response.ok) {
      // Revert optimistic local update on failure
      target.active = !target.active;
      syncLocalOffers(offers);
      const errText = await response.text().catch(() => '');
      throw new Error(errText || `HTTP ${response.status}`);
    }
    const saved = await response.json();
    // Sync the server-returned value back to local cache
    const idx = offers.findIndex((o) => o.id === id);
    if (idx >= 0) offers[idx] = saved;
    syncLocalOffers(offers);
  } catch (error) {
    console.error('toggleOffer failed:', error);
    throw error;
  }
};

// --- STORE & PAYMENT SETTINGS ---

const getStoreSettingsFromLocal = () => {
  const data = localStorage.getItem('vasuki_settings');
  if (!data) {
    localStorage.setItem('vasuki_settings', JSON.stringify(defaultStoreSettings));
    backgroundFetch(STORE_SETTINGS_API, syncLocalStoreSettings);
    return defaultStoreSettings;
  }
  const parsed = JSON.parse(data);
  backgroundFetch(STORE_SETTINGS_API, syncLocalStoreSettings);
  return parsed;
};

export const getStoreSettings = () => getStoreSettingsFromLocal();

export const refreshStoreSettings = async () => {
  const settings = await fetchJson(STORE_SETTINGS_API);
  syncLocalStoreSettings(settings);
  return settings;
};

export const updateStoreSettings = async (settings) => {
  const current = getStoreSettingsFromLocal();
  const nextSettings = { ...current, ...settings };
  syncLocalStoreSettings(nextSettings);
  const savedSettings = await fetchJson(STORE_SETTINGS_API, {
    method: 'POST',
    body: JSON.stringify(nextSettings),
  });
  syncLocalStoreSettings(savedSettings);
  return savedSettings;
};

export const saveStoreSettings = updateStoreSettings;

const getPaymentSettingsFromLocal = () => {
  const data = localStorage.getItem('vasuki_payment_settings');
  if (!data) {
    localStorage.setItem('vasuki_payment_settings', JSON.stringify(defaultPaymentSettings));
    backgroundFetch(PAYMENT_SETTINGS_API, syncLocalPaymentSettings);
    return defaultPaymentSettings;
  }
  const parsed = JSON.parse(data);
  backgroundFetch(PAYMENT_SETTINGS_API, syncLocalPaymentSettings);
  return parsed;
};

export const getPaymentSettings = () => getPaymentSettingsFromLocal();

export const updatePaymentSettings = (settings) => {
  const current = getPaymentSettingsFromLocal();
  const nextSettings = { ...current, ...settings };
  syncLocalPaymentSettings(nextSettings);
  fetch(PAYMENT_SETTINGS_API, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify(nextSettings),
  }).catch(() => {
    // ignore
  });
};

// --- USER PROFILE, ADDRESSES & CUSTOMERS ---

const getUserProfileFromLocal = (email) => {
  const profiles = JSON.parse(localStorage.getItem('vasuki_user_profiles') || '{}');
  if (email && profiles[email]) {
    return profiles[email];
  }
  return {
    name: '',
    email: email || '',
    phone: '',
    addresses: [],
    wishlist: [],
  };
};

export const getUserProfile = (email) => {
  const profile = getUserProfileFromLocal(email);
  if (email) {
    backgroundFetch(`${USER_PROFILES_API}/${encodeURIComponent(email)}`, (data) => {
      const profiles = JSON.parse(localStorage.getItem('vasuki_user_profiles') || '{}');
      profiles[email] = data;
      syncLocalUserProfiles(profiles);
    });
  }
  return profile;
};

export const getUserProfileAsync = async (email) => {
  if (!email) return getUserProfile('');
  try {
    const profile = await fetchJson(`${USER_PROFILES_API}/${encodeURIComponent(email)}`);
    const profiles = JSON.parse(localStorage.getItem('vasuki_user_profiles') || '{}');
    profiles[email] = profile;
    syncLocalUserProfiles(profiles);
    return profile;
  } catch {
    return getUserProfile(email);
  }
};

export const saveUserProfile = (email, profileData) => {
  const profiles = JSON.parse(localStorage.getItem('vasuki_user_profiles') || '{}');
  profiles[email] = {
    ...profiles[email],
    ...profileData,
    email,
  };
  syncLocalUserProfiles(profiles);
  fetch(`${USER_PROFILES_API}/${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify(profiles[email]),
  }).catch(() => {
    // ignore
  });
  return profiles[email];
};

export const getWishlist = (email) => {
  if (!email) {
    return JSON.parse(localStorage.getItem('vasuki_guest_wishlist') || '[]');
  }
  const profile = getUserProfile(email);
  return profile.wishlist || [];
};

export const toggleWishlist = (email, productId) => {
  let list = getWishlist(email);
  if (list.includes(productId)) {
    list = list.filter(id => id !== productId);
  } else {
    list.push(productId);
  }

  if (!email) {
    localStorage.setItem('vasuki_guest_wishlist', JSON.stringify(list));
  } else {
    saveUserProfile(email, { wishlist: list });
  }
  return list;
};

export const isProductInWishlist = (email, productId) => {
  const list = getWishlist(email);
  return list.includes(productId);
};

export const getCustomers = () => {
  const customers = localStorage.getItem('vasuki_customers');
  if (customers) {
    const parsed = JSON.parse(customers);
    backgroundFetch(CUSTOMERS_API, syncLocalCustomers);
    return parsed;
  }

  const orders = getOrdersFromLocal();
  const customersMap = {};
  orders.forEach((order) => {
    const key = order.customer?.email || order.customer?.phone || order.customer?.name || 'guest';
    if (!customersMap[key]) {
      customersMap[key] = {
        name: order.customer?.name || 'Customer',
        email: order.customer?.email || 'N/A',
        phone: order.customer?.phone || 'N/A',
        totalOrders: 0,
        lastOrder: order.date,
      };
    }
    customersMap[key].totalOrders += 1;
    if (new Date(order.date) > new Date(customersMap[key].lastOrder)) {
      customersMap[key].lastOrder = order.date;
    }
  });
  const result = Object.values(customersMap);
  localStorage.setItem('vasuki_customers', JSON.stringify(result));
  backgroundFetch(CUSTOMERS_API, syncLocalCustomers);
  return result;
};

export const getAdminProfile = () => {
  const data = localStorage.getItem('vasuki_admin_profile');
  if (!data) {
    localStorage.setItem('vasuki_admin_profile', JSON.stringify(defaultAdminProfile));
    backgroundFetch(ADMIN_PROFILE_API, syncLocalAdminProfile);
    return defaultAdminProfile;
  }
  const parsed = JSON.parse(data);
  backgroundFetch(ADMIN_PROFILE_API, syncLocalAdminProfile);
  return parsed;
};

export const updateAdminProfile = (profile) => {
  const nextProfile = { ...defaultAdminProfile, ...profile };
  localStorage.setItem('vasuki_admin_profile', JSON.stringify(nextProfile));
  fetch(ADMIN_PROFILE_API, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify(nextProfile),
  }).catch(() => {
    // offline fallback
  });
  return nextProfile;
};

// --- SHIPPING RULES ---

const defaultShippingRules = {
  defaultCharge: 80,
  states: {}
};

const syncLocalShippingRules = (rules) => {
  localStorage.setItem('vasuki_shipping_rules', JSON.stringify(rules));
};

export const getShippingRules = async () => {
  try {
    const rules = await fetchJson(SHIPPING_RULES_API);
    if (rules && typeof rules === 'object') {
      syncLocalShippingRules(rules);
      return rules;
    }
  } catch {
    // fall back to local cache
  }
  const cached = localStorage.getItem('vasuki_shipping_rules');
  if (cached) {
    try { return JSON.parse(cached); } catch { /* ignore */ }
  }
  return defaultShippingRules;
};

export const saveShippingRules = async (rules) => {
  syncLocalShippingRules(rules);
  const response = await fetch(SHIPPING_RULES_API, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify(rules),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `HTTP ${response.status}`);
  }
  const saved = await response.json();
  syncLocalShippingRules(saved);
  return saved;
};

/**
 * Look up a PIN code via the backend proxy endpoint.
 * Returns { valid, pin, state, district, postOffice, shippingCharge, error }
 */
export const lookupPincode = async (pin) => {
  if (!/^[0-9]{6}$/.test(String(pin || ''))) {
    return { valid: false, error: 'Please enter a valid 6-digit Indian PIN code.' };
  }
  try {
    const result = await fetchJson(`${PINCODE_API_BASE}/${pin}`);
    return result;
  } catch (err) {
    const msg = err?.message || '';
    if (msg.includes('404') || msg.includes('not found')) {
      return { valid: false, error: "We couldn't identify this PIN code. Please verify it." };
    }
    return { valid: false, error: 'Unable to look up PIN code. Please try again.' };
  }
};
