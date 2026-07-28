import React from 'react';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import './styles/app.css';

export const App = () => {
  return (
    <ShopProvider>
      <div className="app-layout">
        <Header />
        <CategoryChips />
        <main style={{ flex: 1 }}>
          <HeroBanner />
          <div className="main-content">
            <ProductGrid />
          </div>
        </main>
        <ProductDetailModal />
        <CompareModal />
        <CartDrawer />
        <CheckoutModal />
        <Footer />
      </div>
    </ShopProvider>
  );
};
