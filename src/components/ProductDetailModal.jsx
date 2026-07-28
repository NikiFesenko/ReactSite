import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useShop();

  if (!selectedProduct) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
      <div className="modal-card-m3" onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn-m3"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          onClick={() => setSelectedProduct(null)}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '0.5rem' }}>
          <div>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                background: 'var(--md-sys-color-surface-container-high)'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--md-sys-color-surface-container)', padding: '0.75rem', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', display: 'block' }}>Max Speed</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{selectedProduct.specs.maxSpeed}</span>
              </div>
              <div style={{ background: 'var(--md-sys-color-surface-container)', padding: '0.75rem', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', display: 'block' }}>Flight Time</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{selectedProduct.specs.flightTime}</span>
              </div>
              <div style={{ background: 'var(--md-sys-color-surface-container)', padding: '0.75rem', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', display: 'block' }}>Signal Range</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{selectedProduct.specs.range}</span>
              </div>
              <div style={{ background: 'var(--md-sys-color-surface-container)', padding: '0.75rem', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', display: 'block' }}>Protocol</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{selectedProduct.specs.protocol}</span>
              </div>
            </div>
          </div>

          <div>
            <span style={{
              background: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {selectedProduct.badge}
            </span>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
              {selectedProduct.title}
            </h2>

            <div className="rating-row" style={{ marginBottom: '1rem' }}>
              <Star size={16} className="star-icon" />
              <span style={{ fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
                {selectedProduct.rating}
              </span>
              <span>({selectedProduct.reviewsCount} verified pilot reviews)</span>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--md-sys-color-primary)', marginBottom: '1rem' }}>
              ${selectedProduct.price.toFixed(2)}
            </div>

            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {selectedProduct.description}
            </p>

            <button
              className="checkout-m3-btn"
              onClick={() => {
                addToCart(selectedProduct);
                setSelectedProduct(null);
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart — ${selectedProduct.price.toFixed(2)}</span>
            </button>

            <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--md-sys-color-outline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={16} color="var(--md-sys-color-primary)" /> Express Worldwide Drone Shipping Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--md-sys-color-primary)" /> 1-Year AeroX Hardware Warranty & Calibration
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={16} color="var(--md-sys-color-primary)" /> 30-Day Hassle-Free Returns Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
