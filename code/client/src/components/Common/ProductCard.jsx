import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { wishlistAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product, onWishlistToggle }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(product._id, 1);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to add to wishlist'); return; }
    try {
      await wishlistAPI.toggle(product._id);
      onWishlistToggle && onWishlistToggle(product._id);
      toast.success('Wishlist updated');
    } catch { toast.error('Failed'); }
  };

  const finalPrice = product.discountedPrice || product.price;
  const hasDiscount = product.discount > 0;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400'; }}
        />
        {hasDiscount && <span className="product-badge">{product.discount}% OFF</span>}
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}

        <div className="product-hover-actions">
          <button className="hover-btn" onClick={handleWishlist} title="Add to Wishlist">
            <FiHeart size={16} />
          </button>
          {product.stock > 0 && (
            <button className="hover-btn cart-hover-btn" onClick={handleAddToCart} title="Add to Cart">
              <FiShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>

        {product.ratings?.count > 0 && (
          <div className="product-rating">
            <FiStar className="star-icon" size={12} />
            <span>{product.ratings.average}</span>
            <span className="rating-count">({product.ratings.count})</span>
          </div>
        )}

        <div className="product-price">
          <span className="price-main">₹{finalPrice.toLocaleString()}</span>
          {hasDiscount && <span className="price-original">₹{product.price.toLocaleString()}</span>}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="low-stock">Only {product.stock} left!</p>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
          <FiShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
