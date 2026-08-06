import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.name && formData.email && formData.password) {
      registerUser(formData);
      navigate('/dashboard');
    } else {
      setError('Please fill in all required registration fields.');
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
          <div className="w-14 h-14 bg-[#556B2F] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#D97706]/30">
            <UserPlus size={26} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#5C4033]">Create Account</h1>
          <p className="text-xs text-[#5C4033]/70">Join the Vasuki Pickles family for exclusive offers & quick checkout</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-2.5 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-2.5 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
              Mobile Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-2.5 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-2.5 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-2.5 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3.5 rounded-full bg-[#556B2F] hover:bg-[#6B8E23] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg mt-2"
          >
            Create My Account
          </motion.button>
        </form>

        <div className="pt-4 border-t border-[#5C4033]/10 text-center text-xs text-[#5C4033]/70">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8B1E1E] font-bold hover:underline">
            Log in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
