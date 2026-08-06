import { useState } from 'react';
import { getAdminProfile, updateAdminProfile } from '../../services/dataStore';
import Button from '../../components/ui/Button';
import { User } from 'lucide-react';

const AdminProfile = () => {
  const [profile, setProfile] = useState(() => getAdminProfile() || {
    ownerName: '',
    businessName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    instagram: '',
    mapLink: '',
    profileImage: '',
    logoImage: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAdminProfile(profile);
    setMessage('Admin profile updated successfully. Customer site sections will reflect the changes immediately.');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <User size={26} className="text-brand-gold" />
        <div>
          <h2 className="text-3xl font-serif text-brand-cream">Admin Profile</h2>
          <p className="text-brand-cream/60">Update the business profile, phone, social links and display images for the public site.</p>
        </div>
      </div>

      <div className="bg-brand-matte border border-white/10 rounded-3xl p-6 max-w-3xl">
        {message && <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">{message}</div>}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Owner Name</label>
              <input
                name="ownerName"
                value={profile.ownerName}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Business Name</label>
              <input
                name="businessName"
                value={profile.businessName}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">WhatsApp Link</label>
              <input
                name="whatsapp"
                type="url"
                value={profile.whatsapp}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Instagram Link</label>
              <input
                name="instagram"
                type="url"
                value={profile.instagram}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Address</label>
              <input
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Map Link</label>
              <input
                name="mapLink"
                type="url"
                value={profile.mapLink}
                onChange={handleChange}
                className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-brand-cream/70 mb-2">Profile Image URL</label>
                <input
                  name="profileImage"
                  type="url"
                  value={profile.profileImage}
                  onChange={handleChange}
                  className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
                />
              </div>
              <div>
                <label className="block text-sm text-brand-cream/70 mb-2">Logo Image URL</label>
                <input
                  name="logoImage"
                  type="url"
                  value={profile.logoImage}
                  onChange={handleChange}
                  className="w-full bg-brand-black border border-white/10 rounded-2xl px-4 py-3 text-brand-cream"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-right">
            <Button type="submit" variant="primary">Save Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
