import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (email && password) {
      loginUser(email, password);
      navigate('/dashboard');
    } else {
      setError('Please fill in all required login fields.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#F8F3E8] p-4 py-16 text-[#5C4033]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white max-w-md w-full p-8 md:p-10 rounded-[28px] border-2 border-[#5C4033]/15 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#8B1E1E] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#D97706]/30">
            <LogIn size={26} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#5C4033]">Customer Login</h1>
          <p className="text-xs text-[#5C4033]/70">Log in to view your orders, address book & wishlist</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input box */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Password input box */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
            />
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center text-[#5C4033]/80 cursor-pointer font-medium">
              <input type="checkbox" className="mr-2 accent-[#8B1E1E] h-4 w-4" />
              Remember me
            </label>
            <a href="#" className="text-[#8B1E1E] font-bold hover:underline">Forgot password?</a>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3.5 rounded-full bg-[#8B1E1E] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
          >
            Login to Account
          </motion.button>
        </form>

        <div className="pt-4 border-t border-[#5C4033]/10 flex flex-col gap-3 text-center text-xs">
          <p className="text-[#5C4033]/70">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#8B1E1E] font-bold hover:underline">
              Create an Account
            </Link>
          </p>

          <Link
            to="/admin-login"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#5C4033] hover:text-[#8B1E1E] transition-colors pt-1"
          >
            <Shield size={14} className="text-[#D97706]" /> Are you an Administrator? Click here for Admin Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
