import React from 'react';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingBag, Heart, Sliders, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    setSelectedProduct
  } = useShop();

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isCompared = compareList.some((item) => item.id === product.id);

  return (
    <div className="m3-product-card">
      <div
        className="card-image-wrapper"
        onClick={() => setSelectedProduct(product)}
        style={{ cursor: 'pointer' }}
      >
        <img src={product.image} alt={product.title} className="product-image" />
        <span className="category-tag-badge">{product.badge}</span>
        <button
          className={`wishlist-card-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title="Add to Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <h3
          className="product-title"
          onClick={() => setSelectedProduct(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.title}
        </h3>

        <div className="product-specs-chips">
          {product.specs.flightTime && (
            <span className="spec-chip">⏱ {product.specs.flightTime}</span>
          )}
          {product.specs.maxSpeed && (
            <span className="spec-chip">⚡ {product.specs.maxSpeed}</span>
          )}
          {product.specs.protocol && (
            <span className="spec-chip">📡 {product.specs.protocol}</span>
          )}
        </div>

        <div className="rating-row">
          <Star size={14} className="star-icon" />
          <span style={{ fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
            {product.rating}
          </span>
          <span>({product.reviewsCount} reviews)</span>
        </div>

        <div className="card-footer">
          <div className="price-box">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              className={`compare-toggle-btn ${isCompared ? 'active' : ''}`}
              onClick={() => toggleCompare(product)}
              title="Compare specs"
            >
              {isCompared ? <Check size={14} /> : <Sliders size={14} />}
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              className="add-cart-m3-btn"
              onClick={() => addToCart(product)}
            >
              <ShoppingBag size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
