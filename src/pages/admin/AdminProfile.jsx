import { useState } from 'react';
import { getAdminProfile, getStoreSettings, saveStoreSettings, updateAdminProfile } from '../../services/dataStore';
import Button from '../../components/ui/Button';
import { User } from 'lucide-react';

const AdminProfile = () => {
  const [profile, setProfile] = useState(() => {
    const storeSettings = getStoreSettings();
    return {
      ...(getAdminProfile() || {
        ownerName: '',
        businessName: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        instagram: '',
        mapLink: '',
        profileImage: '',
        logoImage: '',
      }),
      heroTitle: storeSettings.heroTitle || '',
      heroSubtitle: storeSettings.heroSubtitle || '',
      heroGradientOverlay: storeSettings.heroGradientOverlay !== false,
    };
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateAdminProfile(profile);
      await saveStoreSettings({
        heroTitle: profile.heroTitle,
        heroSubtitle: profile.heroSubtitle,
        heroGradientOverlay: profile.heroGradientOverlay,
      });
      setMessageType('success');
      setMessage('Admin profile and homepage banner settings updated successfully.');
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Unable to save the admin profile.');
    } finally {
      setSaving(false);
    }
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
        {message && (
          <div role={messageType === 'error' ? 'alert' : 'status'} className={`mb-6 rounded-2xl border p-4 ${messageType === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-red-500/30 bg-red-500/10 text-red-200'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-white/10 p-4">
            <h3 className="text-lg font-semibold text-brand-cream">Homepage Hero Banner Text</h3>
            <div>
              <label className="mb-2 block text-sm text-brand-cream/70">Banner Title</label>
              <input
                name="heroTitle"
                value={profile.heroTitle}
                onChange={handleChange}
                maxLength={100}
                className="admin-form-field w-full rounded-2xl px-4 py-3"
                placeholder="Leave blank to hide the banner title"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-brand-cream/70">Banner Subtitle</label>
              <textarea
                name="heroSubtitle"
                value={profile.heroSubtitle}
                onChange={handleChange}
                rows={3}
                maxLength={300}
                className="admin-form-field min-h-24 w-full resize-y rounded-2xl px-4 py-3"
                placeholder="Leave blank to hide the banner subtitle"
              />
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-brand-black/30 p-3 text-sm text-brand-cream">
              <input
                type="checkbox"
                name="heroGradientOverlay"
                checked={profile.heroGradientOverlay}
                onChange={handleChange}
                className="mt-0.5 h-5 w-5 shrink-0 accent-brand-gold"
              />
              <span>
                <span className="block font-medium">Show dark gradient overlay</span>
                <span className="mt-1 block text-xs text-brand-cream/60">
                  Turn this off to show the hero image without the dark overlay.
                </span>
              </span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Owner Name</label>
              <input
                name="ownerName"
                value={profile.ownerName}
                onChange={handleChange}
                className="admin-form-field w-full rounded-2xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Business Name</label>
              <input
                name="businessName"
                value={profile.businessName}
                onChange={handleChange}
                className="admin-form-field w-full rounded-2xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="admin-form-field w-full rounded-2xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="admin-form-field w-full rounded-2xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">WhatsApp Link</label>
              <input
                name="whatsapp"
                type="text"
                value={profile.whatsapp}
                onChange={handleChange}
                placeholder="Phone number or https://wa.me/... link"
                className="admin-form-field w-full rounded-2xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Instagram Link</label>
              <input
                name="instagram"
                type="url"
                value={profile.instagram}
                onChange={handleChange}
                className="admin-form-field w-full rounded-2xl px-4 py-3"
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
                className="admin-form-field w-full rounded-2xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Map Link</label>
              <input
                name="mapLink"
                type="url"
                value={profile.mapLink}
                onChange={handleChange}
                className="admin-form-field w-full rounded-2xl px-4 py-3"
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
                  className="admin-form-field w-full rounded-2xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm text-brand-cream/70 mb-2">Logo Image URL</label>
                <input
                  name="logoImage"
                  type="url"
                  value={profile.logoImage}
                  onChange={handleChange}
                  className="admin-form-field w-full rounded-2xl px-4 py-3"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-right">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
