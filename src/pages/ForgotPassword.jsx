import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, RotateCw, KeyRound, Sparkles } from 'lucide-react';

const ForgotPassword = ({ adminMode = false }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    forgotAdminPassword,
    verifyAdminResetOtp,
    resetAdminPassword,
  } = useAuth();
  const navigate = useNavigate();
  const otpInputsRef = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // STEP 1: Request OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const res = await (adminMode ? forgotAdminPassword(email) : forgotPassword(email));
    setLoading(false);

    if (res.ok) {
      setSuccessMsg(res.message || 'Verification code sent to your email.');
      setStep(2);
      setCooldown(60);
    } else {
      setError(res.message || 'Unable to send verification code. Please try again.');
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      if (otpInputsRef.current[nextIndex]) {
        otpInputsRef.current[nextIndex].focus();
      }
      return;
    }

    const digit = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputsRef.current[index - 1]) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await (adminMode ? verifyAdminResetOtp(email, fullOtp) : verifyResetOtp(email, fullOtp));
    setLoading(false);

    if (res.ok && (adminMode || res.resetToken)) {
      if (!adminMode) setResetToken(res.resetToken);
      setStep(3);
      setError('');
    } else {
      setError(res.message || 'Invalid verification code. Please check and try again.');
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const minimumPasswordLength = adminMode ? 8 : 6;
    if (!newPassword || newPassword.length < minimumPasswordLength) {
      setError(`New password must be at least ${minimumPasswordLength} characters long.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await (adminMode
      ? resetAdminPassword(email, newPassword)
      : resetPassword(email, resetToken, newPassword));
    setLoading(false);

    if (res.ok) {
      setStep(4);
    } else {
      setError(res.message || 'Unable to reset password. Please try requesting a new code.');
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
        <AnimatePresence mode="wait">
          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#F8F3E8] text-[#D97706] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#5C4033]">
                  {adminMode ? 'Admin Forgot Password?' : 'Forgot Password?'}
                </h1>
                <p className="text-sm text-[#5C4033]/70">
                  Enter the {adminMode ? 'configured admin' : 'registered customer'} email address and we&apos;ll send a 6-digit verification code.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-xs md:text-sm p-3.5 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C4033]/80">
                    {adminMode ? 'Admin Email Address' : 'Email Address'}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D97706] text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-[#B45309] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RotateCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs font-semibold text-[#5C4033]/70 hover:text-[#D97706] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                </Link>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ENTER 6-DIGIT OTP */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#F8F3E8] text-[#D97706] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Mail className="w-7 h-7" />
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#5C4033]">Enter Code</h1>
                <p className="text-xs md:text-sm text-[#5C4033]/70">
                  We sent a 6-digit code to <span className="font-semibold text-[#5C4033]">{email}</span>
                </p>
              </div>

              {successMsg && (
                <div className="bg-amber-50 text-[#B45309] text-xs p-3 rounded-xl border border-amber-200">
                  {successMsg}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 text-xs md:text-sm p-3.5 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-between items-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-13 md:w-12 md:h-14 bg-[#F8F3E8]/60 border-2 border-[#5C4033]/20 rounded-xl text-center font-bold text-xl md:text-2xl text-[#5C4033] focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 focus:bg-white focus:outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-[#D97706] text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-[#B45309] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RotateCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>
              </form>

              <div className="flex justify-between items-center text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#5C4033]/70 hover:text-[#D97706] transition-colors flex items-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Change Email
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={handleSendOtp}
                  className="font-semibold text-[#D97706] hover:text-[#B45309] disabled:text-[#5C4033]/40 transition-colors"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CREATE NEW PASSWORD */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#F8F3E8] text-[#D97706] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#5C4033]">New {adminMode ? 'Admin ' : ''}Password</h1>
                <p className="text-xs md:text-sm text-[#5C4033]/70">
                  Choose a secure password for your account.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-xs md:text-sm p-3.5 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C4033]/80">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#F8F3E8]/50 border border-[#5C4033]/20 rounded-xl px-4 py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all text-[#5C4033]"
                    />
                    <Lock className="w-5 h-5 text-[#5C4033]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C4033]/40 hover:text-[#5C4033]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C4033]/80">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#F8F3E8]/50 border border-[#5C4033]/20 rounded-xl px-4 py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all text-[#5C4033]"
                    />
                    <Lock className="w-5 h-5 text-[#5C4033]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C4033]/40 hover:text-[#5C4033]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D97706] text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-[#B45309] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RotateCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#5C4033]">Password Reset Complete!</h1>
                <p className="text-sm text-[#5C4033]/70">
                  Your password has been updated successfully. You can now log in with your new password.
                </p>
              </div>

              <button
                onClick={() => navigate(adminMode ? '/admin-login' : '/login')}
                className="w-full bg-[#5C4033] text-[#F8F3E8] py-3.5 px-4 rounded-xl font-semibold hover:bg-[#3D2B22] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Continue to Login</span>
                <Sparkles className="w-4 h-4 text-[#D97706]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
