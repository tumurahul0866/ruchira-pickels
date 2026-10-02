import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Share2, MessageCircle } from 'lucide-react';
import { getStoreSettings, refreshStoreSettings } from '../../services/dataStore';

const Footer = () => {
  const [settings, setSettings] = useState(() => getStoreSettings());

  useEffect(() => {
    let isMounted = true;
    const handleSettingsUpdated = (event) => setSettings(event.detail);
    window.addEventListener('vasuki:store-settings-updated', handleSettingsUpdated);
    refreshStoreSettings()
      .then((updatedSettings) => {
        if (isMounted) setSettings(updatedSettings);
      })
      .catch((error) => {
        console.error('Unable to refresh footer store settings:', error);
      });

    return () => {
      isMounted = false;
      window.removeEventListener('vasuki:store-settings-updated', handleSettingsUpdated);
    };
  }, []);

  const businessName = settings.businessName || 'J&D Foods';
  const contactNumber = settings.contactNumber || '+91 8885473903';
  const email = settings.email || 'support@konasemaruchulu.com';
  const address = settings.address || '123 Heritage Spice Lane, Jubilee Hills, Hyderabad, India 500033';

  return (
    <footer className="bg-white text-[#5C4033] border-t border-[#5C4033]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#8B1E1E]">{businessName}</span>
            </Link>
            <p className="text-sm text-[#5C4033]/70 leading-relaxed">
              Crafted to Crave. Experience rich, authentic Konasema pickles made with premium cold-pressed oil and time-tested family recipes.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[#8B1E1E] text-white grid place-items-center transition hover:bg-[#D97706] shadow-sm">
                <Share2 size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#8B1E1E] text-white grid place-items-center transition hover:bg-[#D97706] shadow-sm">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl text-[#5C4033] mb-6">Contact Us</h3>
            <ul className="space-y-4 text-[#5C4033]/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#556B2F] shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#556B2F] shrink-0" />
                <a href={`tel:${contactNumber.replace(/[^\d+]/g, '')}`} className="hover:text-[#8B1E1E]">{contactNumber}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#556B2F] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#8B1E1E]">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#5C4033]/10 pt-8 text-center text-sm text-[#5C4033]/60">
          <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
