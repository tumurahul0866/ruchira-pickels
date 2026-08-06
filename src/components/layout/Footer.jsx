import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Share2, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-[#5C4033] border-t border-[#5C4033]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#8B1E1E]">KONASEMA RUCHULU</span>
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
            <h3 className="font-serif font-bold text-xl text-[#5C4033] mb-6">Explore</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Flavours', path: '/flavours' },
                { name: 'About Us', path: '/about' },
                { name: 'Reviews', path: '/reviews' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-[#5C4033]/70 hover:text-[#D97706] transition-colors font-medium text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl text-[#5C4033] mb-6">Useful Links</h3>
            <ul className="space-y-4">
              {['Terms of Service', 'Shipping Info', 'Returns'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-[#5C4033]/70 hover:text-[#D97706] transition-colors font-medium text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl text-[#5C4033] mb-6">Contact Us</h3>
            <ul className="space-y-4 text-[#5C4033]/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#556B2F] shrink-0 mt-0.5" />
                <span>123 Heritage Spice Lane, Jubilee Hills, Hyderabad, India 500033</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#556B2F] shrink-0" />
                <span>+91 8885473903</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#556B2F] shrink-0" />
                <span>support@konasemaruchulu.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#5C4033]/10 pt-8 text-center text-sm text-[#5C4033]/60">
          <p>&copy; {new Date().getFullYear()} Konasema Ruchulu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
