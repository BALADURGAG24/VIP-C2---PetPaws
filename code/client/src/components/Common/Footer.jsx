import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => (
  <footer style={{ background: '#1A1A2E', color: '#C9D1D9', marginTop: '60px' }}>
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.6rem' }}>🐾</span>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>PetPaws</span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '20px' }}>
            Your one-stop destination for premium pet food and accessories. We care about your pets as much as you do.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
              <a key={i} href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[['/', 'Home'], ['/products', 'All Products'], ['/products?category=Dog+Food', 'Dog Food'], ['/products?category=Cat+Food', 'Cat Food'], ['/products?category=Toys', 'Pet Toys']].map(([path, label]) => (
              <Link key={path} to={path} style={{ color: '#C9D1D9', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div>
          <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>Customer</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[['/profile', 'My Account'], ['/orders', 'Track Order'], ['/cart', 'Cart'], ['/wishlist', 'Wishlist']].map(([path, label]) => (
              <Link key={path} to={path} style={{ color: '#C9D1D9', fontSize: '0.875rem', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.875rem' }}>
              <FiMapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <span>123 Pet Street, Mumbai, Maharashtra 400001</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.875rem' }}>
              <FiPhone size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>+91-9999999999</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.875rem' }}>
              <FiMail size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>support@petpaws.com</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} PetPaws. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem' }}>
          <a href="#" style={{ color: '#C9D1D9' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#C9D1D9' }}>Terms of Service</a>
          <a href="#" style={{ color: '#C9D1D9' }}>Shipping Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
