import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    setIsCheckoutOpen
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag color="var(--md-sys-color-primary)" size={22} />
            <h2 className="drawer-title">Flight Deck Cart</h2>
          </div>
          <button className="icon-btn-m3" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--md-sys-color-outline)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>Your shopping cart is empty.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                Add your favorite FPV drones, radios, or goggles to get started!
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => updateCartQuantity(item.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button className="qty-btn" onClick={() => updateCartQuantity(item.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ color: 'var(--md-sys-color-outline)', padding: '0.3rem' }}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span>Subtotal:</span>
              <span style={{ color: 'var(--md-sys-color-primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="checkout-m3-btn"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
