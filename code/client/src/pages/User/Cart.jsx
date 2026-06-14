import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight, FiTruck } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const { cart, updateItem, removeItem, clearCart, cartTotal, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const shippingFee = cartTotal >= 500 ? 0 : 50;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + shippingFee + tax;

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="loading-spinner" /></div>;

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet. Explore our pet products!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping <FiArrowRight /></Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-product">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=200'}
                    alt={item.name}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=200'; }}
                  />
                  <div>
                    <Link to={`/products/${item.product?._id || item.product}`} className="item-name">{item.name}</Link>
                    {item.variant && <div className="item-variant">{item.variant}</div>}
                    {item.stock <= 5 && item.stock > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>Only {item.stock} left</div>
                    )}
                  </div>
                </div>

                <div className="cart-item-price">₹{item.price.toLocaleString()}</div>

                <div className="qty-controls">
                  <button onClick={() => item.quantity > 1 ? updateItem(item._id, item.quantity - 1) : removeItem(item._id)}>
                    <FiMinus size={13} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItem(item._id, item.quantity + 1)} disabled={item.quantity >= (item.stock || 99)}>
                    <FiPlus size={13} />
                  </button>
                </div>

                <div className="cart-item-total">₹{(item.price * item.quantity).toLocaleString()}</div>

                <button className="remove-btn" onClick={() => removeItem(item._id)} title="Remove">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            <div className="cart-footer">
              <button className="btn btn-ghost" onClick={clearCart}>Clear Cart</button>
              <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? 'text-success' : ''}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
            </div>

            {shippingFee > 0 && (
              <div className="free-shipping-hint">
                <FiTruck size={14} />
                Add ₹{(500 - cartTotal).toLocaleString()} more for free shipping
              </div>
            )}

            <div className="divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              <FiArrowRight />
            </button>

            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                {['💳 Card', '📱 UPI', '🏦 NetBanking', '💵 COD'].map(m => (
                  <span key={m} className="payment-icon">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
