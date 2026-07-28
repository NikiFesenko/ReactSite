import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, CheckCircle, CreditCard, ShieldCheck, PlaneTakeoff } from 'lucide-react';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal } = useShop();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Nikita Fesenko',
    email: 'pilot@aeroxtech.io',
    address: '100 Aviation Boulevard',
    city: 'San Francisco',
    zip: '94107',
    promoCode: ''
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card-m3" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn-m3"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          onClick={handleClose}
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '99px',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justify-content: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle size={42} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Order Confirmed & Clearance Granted!
            </h2>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Order #AX-94821 has been submitted to the hanger. Track telemetry and shipping details sent to <strong>{formData.email}</strong>.
            </p>
            <button className="checkout-m3-btn" onClick={handleClose}>
              Return to Hangar Store
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <PlaneTakeoff color="var(--md-sys-color-primary)" size={26} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dispatch & Checkout</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  Pilot / Customer Name
                </label>
                <input
                  type="text"
                  required
                  className="search-input"
                  style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    Telemetry Email
                  </label>
                  <input
                    type="email"
                    required
                    className="search-input"
                    style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    required
                    className="search-input"
                    style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--md-sys-color-surface-container-low)', padding: '1rem', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Order Summary</div>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                    <span>{item.quantity}x {item.title}</span>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--md-sys-color-primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="checkout-m3-btn" style={{ marginTop: '0.5rem' }}>
                Place Order — ${cartTotal.toFixed(2)}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
