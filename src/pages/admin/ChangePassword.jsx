import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Key, Eye, EyeOff, CheckCircle2, ShieldAlert, Lock, Mail } from 'lucide-react';

const ChangePassword = () => {
  const { changeAdminPassword, changeAdminEmail, getAdminEmail } = useAuth();
  
  // Email states
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailAuthPassword, setEmailAuthPassword] = useState('');
  const [emailMessage, setEmailMessage] = useState(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passMessage, setPassMessage] = useState(null);

  useEffect(() => {
    setCurrentAdminEmail(getAdminEmail());
  }, [getAdminEmail]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailMessage(null);

    if (!newAdminEmail.includes('@')) {
      setEmailMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    const success = await changeAdminEmail(emailAuthPassword, newAdminEmail.trim());
    if (success) {
      setEmailMessage({ type: 'success', text: 'Admin email updated successfully!' });
      setCurrentAdminEmail(newAdminEmail.trim());
      setNewAdminEmail('');
      setEmailAuthPassword('');
    } else {
      setEmailMessage({ type: 'error', text: 'Incorrect admin password verification.' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    const success = await changeAdminPassword(currentPassword, newPassword);
    if (success) {
      setPassMessage({ type: 'success', text: 'Admin password updated successfully! Use your new password on next login.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassMessage({ type: 'error', text: 'Current password is incorrect. Please try again.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-3xl font-serif font-bold text-brand-cream flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-brand-gold/10 border border-brand-gold/20">
            <Key size={24} className="text-brand-gold" />
          </span>
          Admin Credentials & Security Settings
        </h1>
        <p className="text-xs text-brand-cream/60 mt-2 ml-1">
          Update your Admin Email and Admin Portal Password. You will use these new credentials on your next login.
        </p>
      </div>

      {/* SECTION 1: CHANGE ADMIN EMAIL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-6 shadow-xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Mail size={22} className="text-brand-gold" />
          <h2 className="text-xl font-serif font-bold text-brand-cream">Change Admin Login Email</h2>
        </div>

        <div className="bg-brand-black p-4 rounded-2xl border border-brand-gold/20 text-xs text-brand-cream/80 flex justify-between items-center">
          <span>Current Active Admin Email:</span>
          <strong className="text-brand-gold font-mono text-sm">{currentAdminEmail}</strong>
        </div>

        {emailMessage && (
          <div className={`p-4 rounded-2xl border text-xs font-bold ${
            emailMessage.type === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300'
          }`}>
            {emailMessage.text}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream mb-2">
              New Admin Email Address
            </label>
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="e.g. newadmin@konasemaruchulu.com"
              required
              className="w-full bg-white border-2 border-brand-gold/30 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-gold shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream mb-2">
              Confirm Current Admin Password (to authorize email change)
            </label>
            <input
              type="password"
              value={emailAuthPassword}
              onChange={(e) => setEmailAuthPassword(e.target.value)}
              placeholder="Enter current password to verify"
              required
              className="w-full bg-white border-2 border-brand-gold/30 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-gold shadow-inner"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-brand-gold text-brand-black font-extrabold text-xs uppercase tracking-widest hover:bg-brand-gold-light transition-all shadow-md"
          >
            Update Admin Email Address
          </motion.button>
        </form>
      </motion.div>

      {/* SECTION 2: CHANGE ADMIN PASSWORD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 rounded-3xl bg-brand-matte border border-brand-gold/30 space-y-6 shadow-xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Lock size={22} className="text-brand-gold" />
          <h2 className="text-xl font-serif font-bold text-brand-cream">Change Admin Password</h2>
        </div>

        {passMessage && (
          <div className={`p-4 rounded-2xl border text-xs font-bold ${
            passMessage.type === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300'
          }`}>
            {passMessage.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current admin password"
                required
                className="w-full bg-white border-2 border-brand-gold/30 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-gold shadow-inner pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-gold"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream mb-2">
              New Password (min 6 characters)
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full bg-white border-2 border-brand-gold/30 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-gold shadow-inner pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-gold"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-brand-cream mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password to confirm"
                required
                className="w-full bg-white border-2 border-brand-gold/30 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:border-brand-gold shadow-inner pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-gold"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-brand-gold text-brand-black font-extrabold text-xs uppercase tracking-widest hover:bg-brand-gold-light transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Key size={16} /> Update Admin Password
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;