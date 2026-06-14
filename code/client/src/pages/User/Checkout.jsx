import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiCreditCard, FiSmartphone, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import './Checkout.css';

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', icon: <FiDollarSign /> },
  { value: 'Card', label: 'Credit / Debit Card', icon: <FiCreditCard /> },
  { value: 'UPI', label: 'UPI Payment', icon: <FiSmartphone /> },
  { value: 'NetBanking', label: 'Net Banking', icon: <FiCreditCard /> },
];

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry'];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const [address, setAddress] = useState({
    fullName: defaultAddress?.fullName || user?.username || '',
    phone: defaultAddress?.phone || user?.phone || '',
    addressLine1: defaultAddress?.addressLine1 || '',
    addressLine2: defaultAddress?.addressLine2 || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    pincode: defaultAddress?.pincode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');

  const items = cart?.items || [];
  const shippingFee = cartTotal >= 500 ? 0 : 50;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + shippingFee + tax;

  const handleAddressChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (address.phone.length < 10) { toast.error('Enter valid phone number'); return false; }
    if (address.pincode.length !== 6) { toast.error('Enter valid 6-digit pincode'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;
    setSubmitting(true);
    try {
      const orderItems = items.map(item => ({
        product: item.product?._id || item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
      }));

      const res = await orderAPI.create({
        shippingAddress: address,
        paymentMethod,
        orderItems,
        notes,
      });

      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>

        {/* Steps */}
        <div className="checkout-steps">
          {['Shipping Address', 'Payment', 'Review Order'].map((label, i) => (
            <div key={i} className={`checkout-step ${step === i+1 ? 'active' : step > i+1 ? 'done' : ''}`}>
              <div className="step-num">{step > i+1 ? <FiCheckCircle /> : i+1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left */}
          <div className="checkout-form">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="card p-6">
                <h3 className="step-title">Shipping Address</h3>

                {/* Saved addresses */}
                {user?.addresses?.length > 0 && (
                  <div className="saved-addresses">
                    <p className="form-label">Use saved address:</p>
                    {user.addresses.map(addr => (
                      <button key={addr._id} className="saved-addr-btn"
                        onClick={() => setAddress({ ...addr, country: 'India' })}>
                        <div className="addr-name">{addr.fullName}</div>
                        <div className="addr-detail">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</div>
                      </button>
                    ))}
                    <div className="divider" />
                    <p className="form-label">Or enter new address:</p>
                  </div>
                )}

                <div className="address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" name="fullName" value={address.fullName} onChange={handleAddressChange} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input className="form-input" name="phone" value={address.phone} onChange={handleAddressChange} placeholder="9999999999" maxLength={10} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address Line 1 *</label>
                    <input className="form-input" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} placeholder="House/Flat no., Street name" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address Line 2</label>
                    <input className="form-input" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} placeholder="Landmark, Area (optional)" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input className="form-input" name="city" value={address.city} onChange={handleAddressChange} placeholder="Mumbai" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input className="form-input" name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="400001" maxLength={6} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select className="form-select" name="state" value={address.state} onChange={handleAddressChange}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '20px' }} onClick={() => { if (validateAddress()) setStep(2); }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card p-6">
                <h3 className="step-title">Payment Method</h3>
                <div className="payment-options">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.value} className={`payment-option ${paymentMethod === pm.value ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={pm.value} checked={paymentMethod === pm.value} onChange={() => setPaymentMethod(pm.value)} />
                      <span className="payment-icon-wrap">{pm.icon}</span>
                      <span className="payment-label">{pm.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'Card' && (
                  <div className="card-info-notice">
                    <p>💳 Card payment simulation — no real transaction for demo</p>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label">UPI ID</label>
                    <input className="form-input" placeholder="yourname@upi" />
                  </div>
                )}

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea className="form-input" rows={3} placeholder="Any special instructions for your order..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="card p-6">
                <h3 className="step-title">Review Your Order</h3>

                <div className="review-section">
                  <div className="review-block">
                    <div className="review-block-header">
                      <span>Shipping to</span>
                      <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <p><strong>{address.fullName}</strong> · {address.phone}</p>
                    <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                    <p>{address.city}, {address.state} – {address.pincode}</p>
                  </div>

                  <div className="review-block">
                    <div className="review-block-header">
                      <span>Payment</span>
                      <button className="edit-btn" onClick={() => setStep(2)}>Edit</button>
                    </div>
                    <p><strong>{PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}</strong></p>
                  </div>

                  <div className="review-block">
                    <span className="review-block-header"><span>Items ({items.length})</span></span>
                    {items.map(item => (
                      <div key={item._id} className="review-item">
                        <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=80'} />
                        <div className="review-item-info">
                          <span>{item.name}</span>
                          {item.variant && <small>{item.variant}</small>}
                        </div>
                        <span>×{item.quantity}</span>
                        <span className="review-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handlePlaceOrder} disabled={submitting}>
                    {submitting ? 'Placing Order...' : `Place Order · ₹${grandTotal.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="card p-6">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {items.map(item => (
                  <div key={item._id} className="summary-item">
                    <div className="summary-item-img">
                      <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=60'} />
                      <span className="qty-badge">{item.quantity}</span>
                    </div>
                    <span className="summary-item-name">{item.name}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className="checkout-totals">
                <div><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                <div><span>Shipping</span><span className={shippingFee === 0 ? 'text-success' : ''}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span></div>
                <div><span>Tax (5%)</span><span>₹{tax}</span></div>
                <div className="total-row"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
