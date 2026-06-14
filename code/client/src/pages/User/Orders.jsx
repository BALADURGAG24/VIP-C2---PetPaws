import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { FiPackage, FiChevronRight } from 'react-icons/fi';

const STATUS_COLORS = {
  Pending: 'badge-warning', Confirmed: 'badge-info', Processing: 'badge-info',
  Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger', Returned: 'badge-danger',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    setLoading(true);
    orderAPI.getMyOrders(params)
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
            <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter(s)} style={{ border: '1px solid var(--border)' }}>
              {s || 'All Orders'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="loading-spinner" /></div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <FiPackage size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '20px', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ·
                        {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>₹{order.totalPrice.toLocaleString()}</div>
                      <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-info'}`}>{order.orderStatus}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {order.orderItems.slice(0, 4).map((item, i) => (
                      <img key={i} src={item.image} alt={item.name}
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=60'} />
                    ))}
                    {order.orderItems.length > 4 && (
                      <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        +{order.orderItems.length - 4}
                      </div>
                    )}
                    <FiChevronRight style={{ marginLeft: 'auto', alignSelf: 'center', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
