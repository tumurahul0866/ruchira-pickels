import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(returnPath, { replace: true });
    }
  }, [user, navigate, returnPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#F8F3E8] p-4 py-16 text-[#5C4033]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white max-w-md w-full p-8 md:p-10 rounded-[28px] border-2 border-[#5C4033]/15 shadow-xl space-y-6 relative overflow-hidden"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D97706]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-[#F8F3E8] text-[#5C4033] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-[#5C4033]/10">
            <LogIn className="w-7 h-7 text-[#D97706]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#5C4033]">Welcome Back</h1>
          <p className="text-xs md:text-sm text-[#5C4033]/70">
            Sign in to access your orders, profile, and exclusive offers.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-700 text-xs md:text-sm p-3.5 rounded-xl border border-red-200"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* EMAIL FIELD */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C4033]/80">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F3E8]/50 border border-[#5C4033]/20 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all text-[#5C4033]"
              />
              <Mail className="w-5 h-5 text-[#5C4033]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C4033]/80">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F3E8]/50 border border-[#5C4033]/20 rounded-xl px-4 py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all text-[#5C4033]"
              />
              <Lock className="w-5 h-5 text-[#5C4033]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C4033]/40 hover:text-[#5C4033] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C4033] text-[#F8F3E8] py-3.5 px-4 rounded-xl font-semibold hover:bg-[#3D2B22] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#D97706]" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#5C4033]/10 relative z-10 space-y-3">
          <p className="text-xs text-[#5C4033]/70">
            Checking out without an account?{' '}
            <Link to="/checkout" className="font-bold text-[#D97706] hover:text-[#B45309] transition-colors">
              Continue as Guest
            </Link>
          </p>
          <p className="text-[11px] text-[#5C4033]/55">
            Admin? <Link to="/admin-login" className="font-semibold text-[#5C4033]/75 hover:text-[#D97706]">Admin Login</Link>
          </p>
        </div>

        {/* REGISTER LINK */}
        <div className="text-center pt-2 border-t border-[#5C4033]/10 relative z-10">
          <p className="text-xs text-[#5C4033]/70">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-[#D97706] hover:text-[#B45309] transition-colors inline-flex items-center gap-1"
            >
              Create Account <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
