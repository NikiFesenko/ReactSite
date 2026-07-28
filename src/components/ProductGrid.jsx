import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';

export const ProductGrid = () => {
  const { filteredProducts, activeCategory, searchQuery } = useShop();

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">
            {currentCategoryObj ? currentCategoryObj.label : 'Catalog'}
          </h2>
          {searchQuery && (
            <p style={{ fontSize: '0.88rem', color: 'var(--md-sys-color-outline)' }}>
              Showing search results for "{searchQuery}"
            </p>
          )}
        </div>
        <span className="results-count">
          {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Available
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          background: 'var(--md-sys-color-surface-container-low)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          color: 'var(--md-sys-color-outline)'
        }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            No aviation gear found matching your search.
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Try adjusting your category filter or search keywords (e.g., "6S", "FPV", "Radio", "O3").
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
