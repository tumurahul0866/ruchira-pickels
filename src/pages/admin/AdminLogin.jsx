import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, ArrowLeft, Home, ShoppingBag, PhoneCall, Sparkles, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const success = await loginAdmin(cleanEmail, cleanPassword);
    if (success) {
      setError('');
      navigate('/admin');
    } else {
      setError('Invalid admin email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3E8] text-[#5C4033]">
      {/* Top Header Menu Bar for Admin Login Page */}
      <header className="bg-white border-b border-[#5C4033]/15 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#5C4033] flex items-center justify-center text-[#F8F3E8] font-serif font-bold text-lg shadow-md group-hover:scale-105 transition-transform border border-[#D97706]/30">
              K
            </div>
            <div className="flex flex-col">
              <span className="text-base font-serif font-bold tracking-wider text-[#5C4033] group-hover:text-[#8B1E1E] transition-colors leading-tight">
                KONASEMA RUCHULU
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#556B2F] leading-tight">
                Heritage Delta Flavours
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#5C4033]/80">
            <Link to="/" className="hover:text-[#8B1E1E] flex items-center gap-1.5 transition-colors">
              <Home size={14} /> Home
            </Link>
            <Link to="/flavours" className="hover:text-[#8B1E1E] flex items-center gap-1.5 transition-colors">
              <ShoppingBag size={14} /> All Flavours
            </Link>
            <Link to="/contact" className="hover:text-[#8B1E1E] flex items-center gap-1.5 transition-colors">
              <PhoneCall size={14} /> Contact Us
            </Link>
          </nav>

          {/* Right Action: Option to go back to Website without Login */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#D97706] transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={15} /> Go Back to Website
          </Link>
        </div>
      </header>

      {/* Main Admin Login Card Container */}
      <div className="flex-grow flex items-center justify-center p-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg bg-white rounded-[32px] border-2 border-[#5C4033]/15 p-8 md:p-10 shadow-xl space-y-6"
        >
          {/* Badge & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1E1E]/10 border border-[#8B1E1E]/20 text-[#8B1E1E] text-xs uppercase font-extrabold tracking-wider">
              <Shield size={14} className="text-[#D97706]" /> Secure Admin Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#5C4033]">
              Admin Portal Login
            </h1>
            <p className="text-xs sm:text-sm text-[#5C4033]/70 leading-relaxed">
              Manage store orders, products, offers, coupons, images, and website settings.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form with ALWAYS VISIBLE text boxes */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#5C4033] mb-2 flex items-center gap-1.5">
                <Mail size={14} className="text-[#8B1E1E]" /> Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@vasukipickles.com"
                required
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                className="w-full rounded-2xl border-2 border-[#5C4033]/20 bg-white px-4 py-3 text-sm font-semibold text-[#5C4033] placeholder-[#5C4033]/40 focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#5C4033] mb-2 flex items-center gap-1.5">
                <Lock size={14} className="text-[#8B1E1E]" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                className="w-full rounded-2xl border-2 border-[#5C4033]/20 bg-white px-4 py-3 text-sm font-semibold text-[#5C4033] placeholder-[#5C4033]/40 focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all shadow-inner"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full rounded-2xl bg-[#8B1E1E] hover:bg-[#D97706] px-4 py-3.5 font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-all"
            >
              Sign In to Admin Console
            </motion.button>
          </form>

          {/* Quick Option to Return to Website */}
          <div className="pt-4 border-t border-[#5C4033]/10 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link to="/" className="text-[#8B1E1E] hover:underline font-bold flex items-center gap-1">
              <ArrowLeft size={13} /> Return to Store without Login
            </Link>
            <Link to="/login" className="text-[#556B2F] hover:underline font-bold">
              User / Customer Login →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
