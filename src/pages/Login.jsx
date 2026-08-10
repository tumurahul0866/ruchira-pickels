import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, firebaseConfigError } from '../services/firebase';
import { Phone, Shield, ArrowLeft, CheckCircle2, RotateCw, User, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'profile'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [idToken, setIdToken] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const { user, loginPhoneOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from?.pathname || '/dashboard';

  const otpInputsRef = useRef([]);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate(returnPath, { replace: true });
    }
  }, [user, navigate, returnPath]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // Cleanup reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const getFormattedPhone = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const cleanDigits = digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
    return `+91${cleanDigits}`;
  };

  const validatePhoneNumber = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const cleanDigits = digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
    return cleanDigits.length === 10 && /^[6-9]/.test(cleanDigits);
  };

  const setupRecaptcha = () => {
    if (firebaseConfigError || !auth) {
      console.error('[Login] Firebase not configured:', firebaseConfigError);
      return null;
    }
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;
    
    const container = document.getElementById('recaptcha-container');
    if (!container) return null;

    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try sending OTP again.');
        },
      });
      recaptchaVerifierRef.current = verifier;
      return verifier;
    } catch (err) {
      console.error('RecaptchaVerifier setup error:', err);
      return null;
    }
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (firebaseConfigError || !auth) {
      setError('Phone authentication is not available. Firebase configuration is missing. Please contact the site administrator.');
      console.error('[Login] Firebase config error:', firebaseConfigError);
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const formattedPhone = getFormattedPhone(phone);
    setLoading(true);

    try {
      const appVerifier = setupRecaptcha();
      if (!appVerifier) {
        throw new Error('Unable to initialize reCAPTCHA verifier. Please refresh the page.');
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      setCooldown(30);
      setLoading(false);
    } catch (err) {
      console.error('Send OTP error:', err);
      setLoading(false);
      
      const code = err.code || '';
      let errMsg = 'Failed to send OTP. Please try again.';

      if (code.includes('invalid-phone-number')) {
        errMsg = 'Please enter a valid 10-digit Indian mobile number.';
      } else if (code.includes('too-many-requests')) {
        errMsg = 'Too many OTP attempts from this device. Please wait a few minutes before trying again.';
      } else if (code.includes('quota-exceeded')) {
        errMsg = 'SMS quota limit reached. Please try again later.';
      } else if (code.includes('api-key-not-valid') || code.includes('invalid-api-key') || code.includes('invalid-app-credential')) {
        errMsg = 'Firebase authentication configuration error (Invalid API Key). Please verify VITE_FIREBASE_API_KEY in Vercel.';
      } else if (code.includes('operation-not-allowed')) {
        errMsg = 'Phone Authentication is not enabled in Firebase Console. Please enable Phone provider in Firebase settings.';
      } else if (code.includes('app-not-authorized') || code.includes('unauthorized-domain')) {
        errMsg = 'Domain not authorized in Firebase Console. Please add ruchira-pickels.vercel.app to Authorized Domains.';
      } else if (code.includes('captcha-check-failed')) {
        errMsg = 'Security verification failed. Please refresh the page and try again.';
      } else if (err.message) {
        errMsg = err.message.replace(/^Firebase:\s*/i, '').replace(/\(auth\/[^)]+\)\.?/i, '').trim();
      }
      
      setError(errMsg);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Paste handling
      const pastedDigits = value.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
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

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    if (!confirmationResult) {
      setError('Session expired. Please send OTP again.');
      setStep('phone');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(fullOtp);
      const userFirebase = result.user;
      const token = await userFirebase.getIdToken();
      setIdToken(token);

      // Authenticate with backend
      const res = await loginPhoneOTP(token);
      setLoading(false);

      if (!res.ok) {
        setError(res.message || 'Authentication failed. Please try again.');
        return;
      }

      if (res.isNewUser) {
        // First time user -> Prompt profile completion
        setStep('profile');
      } else {
        // Existing user -> Login successful!
        navigate(returnPath, { replace: true });
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setLoading(false);
      let errMsg = 'Invalid OTP code. Please check and try again.';
      if (err.code === 'auth/invalid-verification-code') {
        errMsg = 'Incorrect OTP entered. Please check the SMS and try again.';
      } else if (err.code === 'auth/code-expired') {
        errMsg = 'OTP has expired. Please click Resend OTP to get a new code.';
      }
      setError(errMsg);
    }
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !name.trim()) {
      setError('Full Name is required to complete your profile.');
      return;
    }

    setLoading(true);
    const res = await loginPhoneOTP(idToken, { name: name.trim(), email: email.trim() });
    setLoading(false);

    if (res.ok) {
      navigate(returnPath, { replace: true });
    } else {
      setError(res.message || 'Unable to save profile. Please try again.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#F8F3E8] p-4 py-16 text-[#5C4033]">
      <div id="recaptcha-container"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white max-w-md w-full p-8 md:p-10 rounded-[28px] border-2 border-[#5C4033]/15 shadow-xl space-y-6 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {/* STEP 1: ENTER PHONE NUMBER */}
          {step === 'phone' && (
            <motion.div
              key="step-phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#8B1E1E] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#D97706]/30">
                  <Phone size={26} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#5C4033]">Welcome Back 👋</h1>
                <p className="text-xs text-[#5C4033]/70">Enter your mobile number to receive a 6-digit OTP</p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#F8F3E8] border-2 border-[#5C4033]/18 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-bold shrink-0">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      autoFocus
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit number"
                      maxLength={14}
                      className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-semibold focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner tracking-wider"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  disabled={loading}
                  className={`w-full py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                    loading ? 'bg-[#B66B6B] cursor-not-allowed' : 'bg-[#8B1E1E] hover:bg-[#D97706]'
                  }`}
                >
                  {loading ? (
                    <>
                      <RotateCw size={16} className="animate-spin" /> Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </motion.button>
              </form>

              <div className="pt-4 border-t border-[#5C4033]/10 flex flex-col gap-3 text-center text-xs">
                <Link
                  to="/admin-login"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#5C4033] hover:text-[#8B1E1E] transition-colors pt-1"
                >
                  <Shield size={14} className="text-[#D97706]" /> Are you an Administrator? Click here for Admin Login
                </Link>
              </div>
            </motion.div>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 'otp' && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#556B2F] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#D97706]/30">
                  <Sparkles size={26} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#5C4033]">Verify Mobile Number</h1>
                <p className="text-xs text-[#5C4033]/80">
                  OTP sent to <span className="font-bold text-[#8B1E1E]">{getFormattedPhone(phone)}</span>
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="flex justify-between items-center gap-2 max-w-xs mx-auto">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 text-center text-xl font-bold bg-[#F8F3E8] border-2 border-[#5C4033]/25 rounded-xl text-[#5C4033] focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  disabled={loading}
                  className={`w-full py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                    loading ? 'bg-[#7A9151] cursor-not-allowed' : 'bg-[#556B2F] hover:bg-[#6B8E23]'
                  }`}
                >
                  {loading ? (
                    <>
                      <RotateCw size={16} className="animate-spin" /> Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </motion.button>
              </form>

              <div className="pt-2 text-center text-xs space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#5C4033]/70">Didn't receive OTP?</span>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={cooldown > 0 || loading}
                    className={`font-bold hover:underline ${
                      cooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-[#8B1E1E]'
                    }`}
                  >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C4033]/70 hover:text-[#8B1E1E]"
                  >
                    <ArrowLeft size={14} /> Change phone number
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FIRST-TIME USER PROFILE COMPLETION */}
          {step === 'profile' && (
            <motion.div
              key="step-profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#D97706] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#8B1E1E]/30">
                  <User size={26} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#5C4033]">Complete Your Profile</h1>
                <p className="text-xs text-[#5C4033]/70">Tell us your name to set up your account</p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
                    Verified Mobile Phone
                  </label>
                  <div className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-300 rounded-2xl px-4 py-3 text-sm text-emerald-800 font-bold">
                    <span>{getFormattedPhone(phone)}</span>
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Varma"
                      className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-1.5">
                    Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/18 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  disabled={loading}
                  className={`w-full py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2 ${
                    loading ? 'bg-[#B66B6B] cursor-not-allowed' : 'bg-[#8B1E1E] hover:bg-[#D97706]'
                  }`}
                >
                  {loading ? (
                    <>
                      <RotateCw size={16} className="animate-spin" /> Saving Profile...
                    </>
                  ) : (
                    'Continue'
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
