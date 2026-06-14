import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiChevronLeft } from 'react-icons/fi';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
const STATUS_COLORS = {
  Pending: 'badge-warning', Confirmed: 'badge-info', Processing: 'badge-info',
  Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger', Returned: 'badge-danger',
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(res => {
        setOrder(res.data.order);
        setNewStatus(res.data.order.orderStatus);
        setTrackingNumber(res.data.order.trackingNumber || '');
      })
      .catch(() => navigate('/admin/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await orderAPI.updateStatus(id, { status: newStatus, note, trackingNumber });
      setOrder(res.data.order);
      setNote('');
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setUpdating(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="loading-spinner" /></div>;
  if (!order) return null;

  return (
    <div>
      <div className="admin-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/orders')}><FiChevronLeft /> Back</button>
          <div>
            <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-info'}`} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>{order.orderStatus}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Order Items */}
          <div className="card p-6">
            <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Order Items</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: i < order.orderItems.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=80'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                  {item.variant && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.variant}</div>}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>₹{item.price.toLocaleString()} × {item.quantity}</div>
                </div>
                <div style={{ fontWeight: '800' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Customer Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card p-6">
              <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Customer</h4>
              <p style={{ fontWeight: '600' }}>{order.user?.username}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.user?.email}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.user?.phone}</p>
            </div>
            <div className="card p-6">
              <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Shipping Address</h4>
              <p style={{ fontWeight: '600' }}>{order.shippingAddress?.fullName}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.shippingAddress?.phone}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Order History */}
          <div className="card p-6">
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Status History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.statusHistory?.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{h.status}</div>
                    {h.note && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.note}</div>}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{new Date(h.timestamp).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Update Status */}
          <div className="card p-6">
            <h4 style={{ fontWeight: '700', marginBottom: '14px' }}>Update Order Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tracking Number</label>
                <input className="form-input" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="e.g., BD123456789" />
              </div>
              <div className="form-group">
                <label className="form-label">Note</label>
                <textarea className="form-input" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note..." style={{ resize: 'none' }} />
              </div>
              <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={updating}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="card p-6">
            <h4 style={{ fontWeight: '700', marginBottom: '14px' }}>Payment Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tax</span><span>₹{order.taxPrice?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.05rem', paddingTop: '8px', borderTop: '1px solid var(--border)', marginTop: '4px' }}>
                <span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span>
              </div>
              <div style={{ marginTop: '8px', padding: '8px 12px', background: order.paymentStatus === 'Paid' ? '#D1FAE5' : '#FEF3C7', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontWeight: '700', color: order.paymentStatus === 'Paid' ? '#065F46' : '#92400E' }}>
                {order.paymentMethod} · {order.paymentStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
