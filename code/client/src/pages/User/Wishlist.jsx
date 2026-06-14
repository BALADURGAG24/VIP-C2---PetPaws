import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.get();
      setWishlist(res.data.wishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  const handleMoveToCart = async (product) => {
    const success = await addToCart(product._id, 1);
    if (success) handleRemove(product._id);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
      <div className="loading-spinner" />
    </div>
  );

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="container">
        <div className="page-header">
          <h1>My Wishlist</h1>
          <p>{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <FiHeart size={52} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
            <h3 style={{ fontWeight: '700', marginBottom: '8px' }}>Your wishlist is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Save products you love to buy them later</p>
            <Link to="/products" className="btn btn-primary">Discover Products</Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map(product => {
              const finalPrice = product.discountedPrice || product.price;
              return (
                <div key={product._id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--surface-2)' }}>
                    <Link to={`/products/${product._id}`}>
                      <img src={product.image} alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400'} />
                    </Link>
                    <button
                      onClick={() => handleRemove(product._id)}
                      style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', boxShadow: 'var(--shadow-md)' }}
                      title="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>{product.category}</div>
                    <Link to={`/products/${product._id}`} style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text)', textDecoration: 'none', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                      <span style={{ fontWeight: '800', fontSize: '1rem' }}>₹{finalPrice.toLocaleString()}</span>
                      {product.discount > 0 && <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>}
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', gap: '6px' }}
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <FiShoppingCart size={14} />
                      {product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
