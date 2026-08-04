import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { getStoreSettings } from '../services/dataStore';

const Contact = () => {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSettings(getStoreSettings());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex-grow bg-brand-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold text-brand-gold mb-6"
          >
            Get in Touch
          </motion.h1>
          <p className="text-brand-cream/70 text-lg max-w-2xl mx-auto">
            Have a question about our flavours? Want to place a bulk order? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="glass-panel p-8 rounded-2xl border border-brand-gold/20">
              <h2 className="text-2xl font-serif text-brand-cream mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-brand-cream font-bold mb-1">Our Location</h3>
                    <p className="text-brand-cream/60">{settings.address || '123 Spice Lane, Culinary District, Hyderabad, Telangana, India 500001'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-brand-cream font-bold mb-1">Phone Number</h3>
                    <p className="text-brand-cream/60">{settings.contactNumber || '+91 8885473903'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
                    <Mail className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-brand-cream font-bold mb-1">Email Address</h3>
                    <p className="text-brand-cream/60">{settings.email || 'hello@acharruchi.com'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-brand-cream font-bold mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <a href={`https://wa.me/${(settings.contactNumber || '+918885473903').replace(/\D/g, '')}?text=${encodeURIComponent(settings.whatsappMessage || 'Hi! I would like to place an order for Acharruchi.')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white px-6 py-3 rounded-lg transition-colors" style={{background: 'var(--color-brand-green)'}}>
                    <MessageCircle size={20} /> WhatsApp
                  </a>
                  <a href={settings.instagram || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-tr from-[#fd5949] to-[#d6249f] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                    <Share2 size={20} /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-brand-gold/20">
              <h2 className="text-2xl font-serif text-brand-cream mb-6">Send us a Message</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-cream/70 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border-2 border-brand-gold/50 rounded-lg px-4 py-3 text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:border-brand-gold focus:bg-white/10 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-cream/70 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border-2 border-brand-gold/50 rounded-lg px-4 py-3 text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:border-brand-gold focus:bg-white/10 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-cream/70 mb-2">Message</label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border-2 border-brand-gold/50 rounded-lg px-4 py-3 text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:border-brand-gold focus:bg-white/10 transition-all resize-none"
                    placeholder="Tell us your message, questions, or bulk order details..."
                  ></textarea>
                </div>
                <Button variant="primary" type="submit" fullWidth>
                  Send Message
                </Button>
              </div>
            </form>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
