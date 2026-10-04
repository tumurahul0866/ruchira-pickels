import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/layout/Navbar';
import FloatingNavbar from './components/layout/FloatingNavbar';
import Footer from './components/layout/Footer';

// Load route pages on demand so the initial storefront bundle stays small.
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Offers = lazy(() => import('./pages/Offers'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout Wrapper
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#F8F3E8] text-[#5C4033] w-full relative pb-[76px] sm:pb-[80px]">
    <Navbar />
    <FloatingNavbar />
    {children}
    <Footer />
  </div>
);

const PageLoadingFallback = () => (
  <div
    className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F3E8] text-[#5C4033]"
    role="status"
    aria-live="polite"
  >
    <span className="font-serif text-2xl font-bold tracking-wide">J&amp;D FOODS</span>
    <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#5C4033]/15 border-t-[#556B2F]" />
    <span className="text-sm text-[#5C4033]/70">Loading your page...</span>
  </div>
);

function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <AnimatePresence mode="wait">
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
              {/* Admin Routes */}
              <Route path="/admin-forgot-password" element={<ForgotPassword adminMode />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Customer Routes */}
              <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
              <Route path="/flavours" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<Navigate to="/" replace />} />
              <Route path="/our-story" element={<Navigate to="/" replace />} />
              <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
              <Route path="/reviews" element={<CustomerLayout><Reviews /></CustomerLayout>} />
              <Route path="/contact" element={<Navigate to="/reviews" replace />} />
              <Route path="/messages" element={<Navigate to="/reviews" replace />} />
              <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
              <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
              <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
              <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
              <Route path="/forgot-password" element={<CustomerLayout><ForgotPassword /></CustomerLayout>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CustomerLayout><UserDashboard /></CustomerLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <CustomerLayout><UserDashboard defaultTab="wishlist" /></CustomerLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/offers" element={<CustomerLayout><Offers /></CustomerLayout>} />
              {/* Fallback Catch-All Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </Router>
        </CartProvider>
      </AuthProvider>
    </MotionConfig>
  );
}

export default App;
