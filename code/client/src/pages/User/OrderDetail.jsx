import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { FiChevronLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
const STATUS_COLORS = {
  Pending: 'badge-warning', Confirmed: 'badge-info', Processing: 'badge-info',
  Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getOne(id).then(res => setOrder(res.data.order)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await orderAPI.cancel(id, { reason: 'Cancelled by customer' });
      setOrder(res.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally { setCancelling(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="loading-spinner" /></div>;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px', textDecoration: 'none' }}>
          <FiChevronLeft /> Back to Orders
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-info'}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>{order.orderStatus}</span>
            {['Pending', 'Confirmed'].includes(order.orderStatus) && (
              <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        {!isCancelled && (
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Order Status</h3>
            <div style={{ display: 'flex', gap: '0' }}>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ position: 'absolute', top: '13px', left: '50%', width: '100%', height: '3px', background: i < currentStep ? 'var(--success)' : 'var(--border)', zIndex: 0 }} />
                  )}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i <= currentStep ? 'var(--success)' : 'var(--border)',
                    color: 'white', fontSize: '0.75rem', fontWeight: '700', zIndex: 1, position: 'relative',
                  }}>{i < currentStep ? '✓' : i + 1}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, marginTop: '6px', textAlign: 'center', color: i <= currentStep ? 'var(--text)' : 'var(--text-muted)' }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Items Ordered</h3>
          {order.orderItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: i < order.orderItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=80'} />
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item.product}`} style={{ fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none', color: 'var(--text)' }}>{item.name}</Link>
                {item.variant && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.variant}</div>}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>₹{item.price.toLocaleString()} × {item.quantity}</div>
              </div>
              <div style={{ fontWeight: '800' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Shipping */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Shipping Address</h4>
            <p style={{ fontWeight: '600' }}>{order.shippingAddress.fullName}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.shippingAddress.phone}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
            </p>
          </div>

          {/* Payment */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Payment Details</h4>
            <p style={{ fontSize: '0.875rem' }}><strong>Method:</strong> {order.paymentMethod}</p>
            <p style={{ fontSize: '0.875rem', marginTop: '6px' }}><strong>Status:</strong> <span style={{ color: order.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)' }}>{order.paymentStatus}</span></p>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{order.itemsPrice.toLocaleString()}</span></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}><span>Tax</span><span>₹{order.taxPrice.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1rem', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="card" style={{ padding: '16px', marginTop: '16px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <p style={{ fontSize: '0.875rem' }}><strong>Tracking Number:</strong> {order.trackingNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
