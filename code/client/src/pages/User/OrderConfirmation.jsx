// OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.getOne(id).then(res => setOrder(res.data.order)).catch(console.error);
  }, [id]);

  if (!order) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="loading-spinner" /></div>;

  return (
    <div style={{ padding: '48px 0', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ color: 'var(--success)', marginBottom: '16px' }}><FiCheckCircle size={64} /></div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px' }}>Order Confirmed! 🎉</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Thank you for your order. Your order ID is <strong>#{order._id.slice(-8).toUpperCase()}</strong>
      </p>

      <div className="card p-6" style={{ textAlign: 'left', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontWeight: '700' }}>Order Details</h3>
        {order.orderItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < order.orderItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=80'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Qty: {item.quantity}</div>
            </div>
            <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
          </div>
        ))}

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.05rem' }}>
            <span>Total Paid</span>
            <span>₹{order.totalPrice.toLocaleString()}</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            Payment: {order.paymentMethod} · Status: <span style={{ color: 'var(--success)', fontWeight: 600 }}>{order.orderStatus}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={`/orders/${order._id}`} className="btn btn-primary"><FiPackage /> Track Order</Link>
        <Link to="/orders" className="btn btn-outline"><FiTruck /> All Orders</Link>
        <Link to="/" className="btn btn-ghost"><FiHome /> Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
