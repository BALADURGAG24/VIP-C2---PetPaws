import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI, reviewAPI, wishlistAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/Common/ProductCard';
import toast from 'react-hot-toast';
import { FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';
import './ProductDetail.css';

const StarRating = ({ value, onChange, size = 20 }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange && onChange(s)} style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: '2px' }}>
        <FiStar size={size} style={{ color: s <= value ? '#F59E0B' : '#D1D5DB', fill: s <= value ? '#F59E0B' : 'none' }} />
      </button>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [pRes, rRes] = await Promise.all([
          productAPI.getOne(id),
          productAPI.getRelated(id),
        ]);
        setProduct(pRes.data.product);
        setReviews(pRes.data.reviews || []);
        setRelated(rRes.data.products);
        if (user) {
          const me = await import('../../utils/api').then(m => m.authAPI.getMe());
          setInWishlist(me.data.user.wishlist?.includes(id));
        }
      } catch { navigate('/products'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  const handleAddToCart = async () => {
    const success = await addToCart(product._id, quantity, selectedVariant);
    if (success) setQuantity(1);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    const success = await addToCart(product._id, quantity, selectedVariant);
    if (success) navigate('/checkout');
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      await wishlistAPI.toggle(product._id);
      setInWishlist(!inWishlist);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist 💛');
    } catch { toast.error('Failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!reviewForm.title || !reviewForm.comment) { toast.error('Please fill all fields'); return; }
    setSubmittingReview(true);
    try {
      const res = await reviewAPI.add({ productId: product._id, ...reviewForm });
      setReviews(prev => [res.data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><div className="loading-spinner" /></div>;
  if (!product) return null;

  const finalPrice = product.discountedPrice || product.price;
  const images = product.images?.length ? product.images : [product.image];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link><FiChevronRight size={14} />
          <Link to="/products">Products</Link><FiChevronRight size={14} />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><FiChevronRight size={14} />
          <span>{product.name}</span>
        </nav>

        {/* Main */}
        <div className="detail-main">
          {/* Images */}
          <div className="detail-images">
            <div className="main-image-wrap">
              <img src={images[activeImage] || product.image} alt={product.name} className="main-image"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600'; }} />
              {product.discount > 0 && <div className="detail-badge">{product.discount}% OFF</div>}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, i) => (
                  <button key={i} className={`thumbnail ${i === activeImage ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                    <img src={img} alt={`View ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-category">{product.category}</div>
            <h1 className="detail-title">{product.name}</h1>

            {product.brand && <div className="detail-brand">by <strong>{product.brand}</strong></div>}

            {/* Rating */}
            {product.ratings?.count > 0 && (
              <div className="detail-rating">
                <StarRating value={Math.round(product.ratings.average)} size={18} />
                <span className="rating-score">{product.ratings.average}</span>
                <span className="rating-count">({product.ratings.count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="detail-price">
              <span className="detail-price-main">₹{finalPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="detail-price-orig">₹{product.price.toLocaleString()}</span>
                  <span className="detail-save">Save ₹{(product.price - finalPrice).toLocaleString()}</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className={`stock-status ${product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'in'}`}>
              {product.stock === 0 ? '✗ Out of Stock' : product.stock <= 5 ? `⚡ Only ${product.stock} left!` : '✓ In Stock'}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="variants-section">
                <label className="form-label">Select Size/Weight</label>
                <div className="variant-options">
                  {product.variants.map(v => (
                    <button key={v.size} className={`variant-btn ${selectedVariant === v.size ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(v.size)} disabled={v.stock === 0}>
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weight tag */}
            {product.weight && <div className="weight-tag">Weight: {product.weight}</div>}

            {/* Quantity */}
            <div className="quantity-section">
              <label className="form-label">Quantity</label>
              <div className="qty-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} disabled={quantity <= 1}><FiMinus size={14} /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))} disabled={quantity >= product.stock}><FiPlus size={14} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="detail-actions">
              <button className="btn btn-primary btn-lg flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-secondary btn-lg flex-1" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </button>
              <button className={`wishlist-btn ${inWishlist ? 'active' : ''}`} onClick={handleWishlist} title="Add to Wishlist">
                <FiHeart size={20} />
              </button>
            </div>

            {/* Delivery */}
            <div className="delivery-info">
              <div className="delivery-item"><FiTruck size={16} /> Free delivery on orders above ₹500</div>
              <div className="delivery-item"><FiShield size={16} /> 7-day easy returns guaranteed</div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="product-tags">
                {product.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            {['description', 'reviews'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'description' ? 'Description' : `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="tab-content">
              <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>{product.description}</p>
              {product.petType?.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Suitable for:</strong> {product.petType.join(', ')}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-content">
              {/* Write Review */}
              {user && (
                <div className="review-form-card">
                  <h4>Write a Review</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <StarRating value={reviewForm.rating} onChange={r => setReviewForm(p => ({...p, rating: r}))} size={24} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Review Title</label>
                      <input className="form-input" placeholder="Summarize your experience" value={reviewForm.title} onChange={e => setReviewForm(p => ({...p, title: e.target.value}))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Review</label>
                      <textarea className="form-input" rows={4} placeholder="Tell others what you think about this product..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({...p, comment: e.target.value}))} required style={{ resize: 'vertical' }} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>No reviews yet. Be the first to review!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map(r => (
                    <div key={r._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-avatar">{r.user?.username?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="reviewer-name">{r.user?.username}</div>
                          <StarRating value={r.rating} size={14} />
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {r.isVerifiedPurchase && <span className="badge badge-success" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>Verified Purchase</span>}
                      <h5>{r.title}</h5>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px' }}>You May Also Like</h2>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
