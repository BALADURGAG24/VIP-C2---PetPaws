import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { FiSearch, FiEye } from 'react-icons/fi';

const STATUS_COLORS = {
  Pending: 'badge-warning', Confirmed: 'badge-info', Processing: 'badge-info',
  Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger', Returned: 'badge-danger',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (status) params.status = status;
    orderAPI.getAllOrders(params)
      .then(res => {
        setOrders(res.data.orders);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status, page]);

  const STATUS_TABS = ['', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div className="admin-section-header">
        <div>
          <h2>Orders</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>{total} total orders</p>
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {STATUS_TABS.map(s => (
          <button key={s} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-ghost'}`}
            style={{ border: '1px solid var(--border)' }}
            onClick={() => { setStatus(s); setPage(1); }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}><div className="loading-spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td><span style={{ fontWeight: '700', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{order.user?.username || 'Guest'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: '800' }}>₹{order.totalPrice?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                        {order.paymentMethod} · {order.paymentStatus}
                      </span>
                    </td>
                    <td><span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-info'}`}>{order.orderStatus}</span></td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="btn btn-ghost btn-sm" title="View Details">
                        <FiEye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="pagination" style={{ marginTop: '20px' }}>
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              {[...Array(pages)].map((_, i) => (
                <button key={i+1} className={`page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
