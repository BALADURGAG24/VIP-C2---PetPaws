import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings, FiGrid } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const categories = ['Dog Food', 'Cat Food', 'Toys', 'Grooming', 'Accessories', 'Health'];

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">PetPaws</span>
          </Link>

          {/* Search */}
          <form className="search-form" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for pet food, toys, accessories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          {/* Actions */}
          <div className="nav-actions">
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <FiHeart size={20} />
            </Link>

            <Link to="/cart" className="nav-icon-btn cart-btn" title="Cart">
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="profile-menu">
                <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="avatar-sm">{user.username?.charAt(0).toUpperCase()}</div>
                  <span className="username-short">{user.username?.split(' ')[0]}</span>
                </button>
                {profileOpen && (
                  <div className="profile-dropdown" onClick={() => setProfileOpen(false)}>
                    <div className="dropdown-header">
                      <div className="avatar-md">{user.username?.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-semibold">{user.username}</div>
                        <div className="text-sm text-muted">{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    {isAdmin && (
                      <Link to="/admin/dashboard" className="dropdown-item">
                        <FiGrid size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="dropdown-item"><FiUser size={16} /> Profile</Link>
                    <Link to="/orders" className="dropdown-item"><FiPackage size={16} /> My Orders</Link>
                    <div className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            )}

            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="navbar-categories">
        <div className="container">
          <div className="categories-list">
            <Link to="/products" className={`cat-link ${!location.search ? 'active' : ''}`}>All Products</Link>
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="cat-link">{cat}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit">Search</button>
          </form>
          <div className="mobile-links">
            <Link to="/products" onClick={() => setMobileOpen(false)}>All Products</Link>
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} onClick={() => setMobileOpen(false)}>{cat}</Link>
            ))}
            <div className="mobile-divider" />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                {isAdmin && <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="mobile-logout">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
