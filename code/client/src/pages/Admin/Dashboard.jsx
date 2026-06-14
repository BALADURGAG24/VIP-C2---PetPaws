import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiAlertTriangle, FiClock } from 'react-icons/fi';

const STATUS_COLORS = {
  Pending: 'badge-warning', Confirmed: 'badge-info', Processing: 'badge-info',
  Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
      <div className="loading-spinner" />
    </div>
  );

  const STAT_CARDS = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#FFF3EE', iconColor: '#FF6B35', change: '+12% this month' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: '#EFF6FF', iconColor: '#3B82F6', change: `${stats?.pendingOrders || 0} pending` },
    { label: 'Customers', value: stats?.totalUsers || 0, icon: '👥', color: '#F0FDF4', iconColor: '#10B981', change: 'Registered users' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: '🏷️', color: '#FDF4FF', iconColor: '#A855F7', change: 'Active listings' },
  ];

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxRevenue = Math.max(...(stats?.monthlySales?.map(m => m.revenue) || [1]));

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {STAT_CARDS.map((card, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: card.color }}>
              <span>{card.icon}</span>
            </div>
            <div>
              <div className="admin-stat-value">{card.value}</div>
              <div className="admin-stat-label">{card.label}</div>
              <div className="admin-stat-change" style={{ color: 'var(--text-muted)' }}>{card.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Monthly Revenue Chart */}
        <div className="card p-6">
          <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Monthly Revenue</h3>
          {stats?.monthlySales?.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px' }}>
              {stats.monthlySales.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>₹{(m.revenue/1000).toFixed(0)}k</div>
                  <div style={{ width: '100%', background: 'var(--primary)', borderRadius: '4px 4px 0 0', height: `${(m.revenue / maxRevenue) * 130}px`, minHeight: '4px', transition: 'height 0.3s' }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{monthNames[m._id.month - 1]}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No sales data yet</p>
          )}
        </div>

        {/* Low Stock */}
        <div className="card p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700' }}>⚠️ Low Stock Alert</h3>
            <Link to="/admin/products" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
          </div>
          {stats?.lowStockProducts?.length === 0 ? (
            <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>✓ All products have sufficient stock</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats?.lowStockProducts?.map(p => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: p.stock === 0 ? '#FEF2F2' : '#FFFBEB', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{p.name.slice(0, 30)}...</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.category}</div>
                  </div>
                  <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Orders */}
        <div className="admin-table-wrap">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order._id}>
                  <td><Link to={`/admin/orders/${order._id}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>#{order._id.slice(-6).toUpperCase()}</Link></td>
                  <td style={{ fontSize: '0.85rem' }}>{order.user?.username || 'Guest'}</td>
                  <td style={{ fontWeight: '700' }}>₹{order.totalPrice?.toLocaleString()}</td>
                  <td><span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-info'}`}>{order.orderStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="admin-table-wrap">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>🏆 Top Products</h3>
            <Link to="/admin/products" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Sold</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topProducts?.map((p, i) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.8rem', width: '16px' }}>#{i+1}</span>
                      <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=60'} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.name.slice(0,25)}...</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.category}</td>
                  <td><span className="badge badge-success">{p.soldCount}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
