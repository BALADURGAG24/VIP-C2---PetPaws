import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings,
  FiMenu, FiX, FiLogOut, FiBell, FiChevronRight
} from 'react-icons/fi';
import './AdminLayout.css';

const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
  { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { path: '/admin/users', icon: <FiUsers />, label: 'Customers' },
  { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">🐾</span>
          {sidebarOpen && <span className="logo-text">PetPaws Admin</span>}
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><FiLogOut /></span>
            {sidebarOpen && <span className="nav-label">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div className="admin-breadcrumb">Admin Panel</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="topbar-icon-btn"><FiBell size={18} /></button>
            <div className="admin-user">
              <div className="admin-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user?.username}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
