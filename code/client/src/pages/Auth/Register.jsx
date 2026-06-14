import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register({ username: form.username, email: form.email, phone: form.phone, password: form.password });
      login(res.data.token, res.data.user);
      toast.success('Account created! Welcome to PetPaws 🐾');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🐾</span>
          <span>PetPaws</span>
        </div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join thousands of happy pet parents</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-wrap">
              <FiUser className="input-icon" size={16} />
              <input className="form-input with-icon" placeholder="John Doe"
                value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-wrap">
              <FiMail className="input-icon" size={16} />
              <input className="form-input with-icon" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-wrap">
              <FiPhone className="input-icon" size={16} />
              <input className="form-input with-icon" placeholder="+91 9999999999"
                value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="input-wrap">
              <FiLock className="input-icon" size={16} />
              <input className="form-input with-icon" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div className="input-wrap">
              <FiLock className="input-icon" size={16} />
              <input className="form-input with-icon" type="password" placeholder="Repeat password"
                value={form.confirmPassword} onChange={e => setForm(p => ({...p, confirmPassword: e.target.value}))} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
