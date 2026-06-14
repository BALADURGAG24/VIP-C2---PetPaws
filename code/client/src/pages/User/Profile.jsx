import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ username: user?.username || '', phone: user?.phone || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false });

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(profileData);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordData.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await userAPI.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleAddAddress = async () => {
    try {
      const res = editingAddr
        ? await userAPI.updateAddress(editingAddr, addrForm)
        : await userAPI.addAddress(addrForm);
      updateUser({ ...user, addresses: res.data.addresses });
      setShowAddressForm(false);
      setEditingAddr(null);
      setAddrForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false });
      toast.success(editingAddr ? 'Address updated' : 'Address added');
    } catch (err) { toast.error('Failed to save address'); }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await userAPI.deleteAddress(addrId);
      updateUser({ ...user, addresses: res.data.addresses });
      toast.success('Address deleted');
    } catch { toast.error('Failed'); }
  };

  const startEditAddress = (addr) => {
    setAddrForm({ fullName: addr.fullName, phone: addr.phone, addressLine1: addr.addressLine1, addressLine2: addr.addressLine2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setEditingAddr(addr._id);
    setShowAddressForm(true);
  };

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{user?.username}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px', width: 'fit-content' }}>
          {[['profile', <FiUser key="u" />, 'Profile'], ['password', <FiLock key="l" />, 'Password'], ['addresses', <FiMapPin key="m" />, 'Addresses']].map(([tab, icon, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
              style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-6">
            <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Personal Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profileData.username} onChange={e => setProfileData(p => ({...p, username: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email (cannot change)</label>
                <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={profileData.phone} onChange={e => setProfileData(p => ({...p, phone: e.target.value}))} placeholder="+91 9999999999" />
              </div>
              <button className="btn btn-primary" onClick={handleProfileSave} disabled={saving} style={{ alignSelf: 'flex-start' }}>
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="card p-6">
            <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Change Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[['currentPassword', 'Current Password', 'password'], ['newPassword', 'New Password', 'password'], ['confirmPassword', 'Confirm New Password', 'password']].map(([field, label, type]) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="form-input" type={type} value={passwordData[field]} onChange={e => setPasswordData(p => ({...p, [field]: e.target.value}))} />
                </div>
              ))}
              <button className="btn btn-primary" onClick={handlePasswordChange} disabled={saving} style={{ alignSelf: 'flex-start' }}>
                <FiLock /> {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '700' }}>Saved Addresses</h3>
              <button className="btn btn-primary btn-sm" onClick={() => { setShowAddressForm(true); setEditingAddr(null); setAddrForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false }); }}>
                <FiPlus /> Add Address
              </button>
            </div>

            {showAddressForm && (
              <div className="card p-6" style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>{editingAddr ? 'Edit' : 'New'} Address</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={addrForm.fullName} onChange={e => setAddrForm(p => ({...p, fullName: e.target.value}))} /></div>
                    <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" value={addrForm.phone} onChange={e => setAddrForm(p => ({...p, phone: e.target.value}))} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Address Line 1 *</label><input className="form-input" value={addrForm.addressLine1} onChange={e => setAddrForm(p => ({...p, addressLine1: e.target.value}))} /></div>
                  <div className="form-group"><label className="form-label">Address Line 2</label><input className="form-input" value={addrForm.addressLine2} onChange={e => setAddrForm(p => ({...p, addressLine2: e.target.value}))} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group"><label className="form-label">City *</label><input className="form-input" value={addrForm.city} onChange={e => setAddrForm(p => ({...p, city: e.target.value}))} /></div>
                    <div className="form-group"><label className="form-label">Pincode *</label><input className="form-input" value={addrForm.pincode} onChange={e => setAddrForm(p => ({...p, pincode: e.target.value}))} maxLength={6} /></div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select className="form-select" value={addrForm.state} onChange={e => setAddrForm(p => ({...p, state: e.target.value}))}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(p => ({...p, isDefault: e.target.checked}))} />
                    Set as default address
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={handleAddAddress}>Save Address</button>
                    <button className="btn btn-ghost" onClick={() => { setShowAddressForm(false); setEditingAddr(null); }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {(!user?.addresses || user.addresses.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No saved addresses</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {user.addresses.map(addr => (
                  <div key={addr._id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700' }}>{addr.fullName}</span>
                        {addr.isDefault && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Default</span>}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{addr.phone}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>{addr.addressLine1}, {addr.city}, {addr.state} – {addr.pincode}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => startEditAddress(addr)}><FiEdit2 size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteAddress(addr._id)} style={{ color: 'var(--danger)' }}><FiTrash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
