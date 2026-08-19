import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/layout/Navbar';
import FloatingNavbar from './components/layout/FloatingNavbar';
import Footer from './components/layout/Footer';

// Customer Pages
import Home from './pages/Home';
import Flavours from './pages/Flavours';
import ProductDetail from './pages/ProductDetail';
import Reviews from './pages/Reviews';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import Offers from './pages/Offers';
import OurStory from './pages/OurStory';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

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
  <div className="flex flex-col min-h-screen bg-[#F8F3E8] text-[#5C4033] w-full relative">
    <Navbar />
    <FloatingNavbar />
    {children}
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Admin Routes */}
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
              <Route path="/flavours" element={<CustomerLayout><Flavours /></CustomerLayout>} />
              <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
              <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
              <Route path="/reviews" element={<CustomerLayout><Reviews /></CustomerLayout>} />
              <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
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
              <Route path="/offers" element={<CustomerLayout><Offers /></CustomerLayout>} />
              <Route path="/our-story" element={<CustomerLayout><OurStory /></CustomerLayout>} />

              {/* Fallback Catch-All Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
