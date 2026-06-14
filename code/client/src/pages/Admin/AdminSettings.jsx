import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', image: '', link: '', isActive: true });
  const [showBannerForm, setShowBannerForm] = useState(false);

  useEffect(() => {
    adminAPI.getSettings()
      .then(res => setSettings(res.data.settings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.updateSettings({
        shippingFee: settings.shippingFee,
        freeShippingAbove: settings.freeShippingAbove,
        taxRate: settings.taxRate,
        siteName: settings.siteName,
        siteTagline: settings.siteTagline,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
      });
      setSettings(res.data.settings);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleAddBanner = async () => {
    if (!bannerForm.title || !bannerForm.image) { toast.error('Title and image required'); return; }
    try {
      const res = await adminAPI.addBanner(bannerForm);
      setSettings(prev => ({ ...prev, banners: res.data.banners }));
      setBannerForm({ title: '', subtitle: '', image: '', link: '', isActive: true });
      setShowBannerForm(false);
      toast.success('Banner added');
    } catch { toast.error('Failed to add banner'); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await adminAPI.deleteBanner(id);
      setSettings(prev => ({ ...prev, banners: prev.banners.filter(b => b._id !== id) }));
      toast.success('Banner deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="loading-spinner" /></div>;

  return (
    <div>
      <div className="admin-section-header">
        <h2>Store Settings</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* General */}
        <div className="card p-6">
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>General Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              ['siteName', 'Store Name'],
              ['siteTagline', 'Tagline'],
              ['contactEmail', 'Contact Email'],
              ['contactPhone', 'Contact Phone'],
            ].map(([key, label]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" value={settings[key] || ''} onChange={e => setSettings(p => ({...p, [key]: e.target.value}))} />
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="card p-6">
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Shipping & Tax</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Shipping Fee (₹)</label>
              <input className="form-input" type="number" value={settings.shippingFee || 0} onChange={e => setSettings(p => ({...p, shippingFee: Number(e.target.value)}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Free Shipping Above (₹)</label>
              <input className="form-input" type="number" value={settings.freeShippingAbove || 500} onChange={e => setSettings(p => ({...p, freeShippingAbove: Number(e.target.value)}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tax Rate (%)</label>
              <input className="form-input" type="number" value={settings.taxRate || 5} onChange={e => setSettings(p => ({...p, taxRate: Number(e.target.value)}))} />
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              💡 Orders above ₹{settings.freeShippingAbove} get free shipping. Others pay ₹{settings.shippingFee}.
              Tax of {settings.taxRate}% is applied on all orders.
            </div>
          </div>
        </div>
      </div>

      {/* Banners */}
      <div className="card p-6" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '700' }}>Homepage Banners</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowBannerForm(!showBannerForm)}>
            <FiPlus /> Add Banner
          </button>
        </div>

        {showBannerForm && (
          <div style={{ background: 'var(--surface-2)', padding: '20px', borderRadius: 'var(--radius)', marginBottom: '16px' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '14px' }}>New Banner</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={bannerForm.title} onChange={e => setBannerForm(p => ({...p, title: e.target.value}))} placeholder="Banner Title" />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={bannerForm.subtitle} onChange={e => setBannerForm(p => ({...p, subtitle: e.target.value}))} placeholder="Subtitle text" />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input className="form-input" value={bannerForm.image} onChange={e => setBannerForm(p => ({...p, image: e.target.value}))} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Link (URL)</label>
                <input className="form-input" value={bannerForm.link} onChange={e => setBannerForm(p => ({...p, link: e.target.value}))} placeholder="/products?category=..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button className="btn btn-primary btn-sm" onClick={handleAddBanner}>Add Banner</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowBannerForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {settings.banners?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No banners configured</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {settings.banners?.map(banner => (
              <div key={banner._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <img src={banner.image} alt={banner.title} style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} onError={e => e.target.style.display = 'none'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{banner.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{banner.subtitle}</div>
                  {banner.link && <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{banner.link}</div>}
                </div>
                <span className={`badge ${banner.isActive ? 'badge-success' : 'badge-warning'}`}>{banner.isActive ? 'Active' : 'Inactive'}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteBanner(banner._id)} style={{ color: 'var(--danger)' }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Overview */}
      <div className="card p-6" style={{ marginTop: '20px' }}>
        <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Configured Categories ({settings.categories?.length || 0})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {settings.categories?.map(cat => (
            <div key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <span>{cat.icon}</span>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{cat.name}</span>
              <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                {cat.isActive ? 'On' : 'Off'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
