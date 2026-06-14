import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../utils/api';
import ProductCard from '../../components/Common/ProductCard';
import { FiArrowRight, FiShield, FiTruck, FiStar, FiRefreshCw } from 'react-icons/fi';
import './Home.css';

const CATEGORY_ICONS = {
  'Dog Food': '🐶', 'Cat Food': '🐱', 'Bird Food': '🐦',
  'Toys': '🎾', 'Grooming': '✂️', 'Dog Accessories': '🦮',
  'Cat Accessories': '🐈', 'Health & Supplements': '💊',
  'Beds & Furniture': '🛏️', 'Leashes & Collars': '🔗',
  'Cages & Habitats': '🏠', 'Fish Food': '🐠',
};

const HERO_SLIDES = [
  {
    title: 'Premium Nutrition for Your Best Friend',
    subtitle: 'Explore 500+ pet food products from trusted brands',
    cta: 'Shop Dog Food',
    link: '/products?category=Dog+Food',
    bg: 'linear-gradient(135deg, #FF6B35 0%, #F7C59F 100%)',
    emoji: '🐶',
  },
  {
    title: 'Accessories Your Pet Will Love',
    subtitle: 'Toys, beds, leashes & more — all in one place',
    cta: 'Browse Accessories',
    link: '/products?category=Dog+Accessories',
    bg: 'linear-gradient(135deg, #2D6A4F 0%, #74C69D 100%)',
    emoji: '🐾',
  },
  {
    title: 'Health & Wellness for Cats',
    subtitle: 'Grooming kits, supplements, and vet-approved products',
    cta: 'Explore Cat Products',
    link: '/products?category=Cat+Food',
    bg: 'linear-gradient(135deg, #6C63FF 0%, #B5B2FF 100%)',
    emoji: '🐱',
  },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getProductCategories(),
        ]);
        setFeatured(featRes.data.products);
        setCategories(catRes.data.categories);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[heroIndex];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" style={{ background: slide.bg }}>
        <div className="hero-content container">
          <div className="hero-text">
            <div className="hero-eyebrow">New Arrivals Every Week 🎉</div>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <div className="hero-actions">
              <Link to={slide.link} className="btn btn-primary btn-lg">
                {slide.cta} <FiArrowRight />
              </Link>
              <Link to="/products" className="btn btn-ghost btn-lg" style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}>
                View All Products
              </Link>
            </div>
          </div>
          <div className="hero-emoji">{slide.emoji}</div>
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero-dot ${i === heroIndex ? 'active' : ''}`} onClick={() => setHeroIndex(i)} />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: <FiTruck />, title: 'Free Shipping', sub: 'On orders above ₹500' },
              { icon: <FiShield />, title: 'Genuine Products', sub: '100% authentic brands' },
              { icon: <FiStar />, title: 'Top Rated', sub: '50,000+ happy pet parents' },
              { icon: <FiRefreshCw />, title: 'Easy Returns', sub: '7-day hassle-free returns' },
            ].map((item, i) => (
              <div key={i} className="trust-item">
                <div className="trust-icon">{item.icon}</div>
                <div>
                  <div className="trust-title">{item.title}</div>
                  <div className="trust-sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>Shop by Category</h2>
                <p>Find exactly what your pet needs</p>
              </div>
              <Link to="/products" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
            </div>
            <div className="categories-grid">
              {categories.slice(0, 8).map(cat => (
                <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="category-card">
                  <div className="category-emoji">{CATEGORY_ICONS[cat] || '🐾'}</div>
                  <span>{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p>Handpicked for your beloved pets</p>
            </div>
            <Link to="/products?featured=true" className="btn btn-outline btn-sm">See All <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Pet Type Banners */}
      <section className="section">
        <div className="container">
          <h2 style={{ marginBottom: '24px', fontSize: '1.4rem', fontWeight: '800' }}>Shop by Pet Type</h2>
          <div className="pet-banners">
            {[
              { label: 'For Dogs', emoji: '🐶', color: '#FF6B35', category: 'Dog Food', desc: 'Food, toys & accessories' },
              { label: 'For Cats', emoji: '🐱', color: '#6C63FF', category: 'Cat Food', desc: 'Premium cat essentials' },
              { label: 'For Birds', emoji: '🐦', color: '#2D6A4F', category: 'Bird Food', desc: 'Cages, food & more' },
              { label: 'For Fish', emoji: '🐠', color: '#0EA5E9', category: 'Fish Food', desc: 'Aquarium & fish care' },
            ].map(pet => (
              <Link key={pet.label} to={`/products?petType=${pet.label.replace('For ', '')}`} className="pet-banner" style={{ '--pet-color': pet.color }}>
                <div className="pet-banner-emoji">{pet.emoji}</div>
                <div>
                  <div className="pet-banner-label">{pet.label}</div>
                  <div className="pet-banner-desc">{pet.desc}</div>
                </div>
                <FiArrowRight className="pet-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div>
              <h2>Join the PetPaws Family</h2>
              <p>Get exclusive deals, expert advice, and early access to new arrivals</p>
            </div>
            <Link to="/register" className="btn btn-primary btn-lg">
              Sign Up Free <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
