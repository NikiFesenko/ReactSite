import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products] = useState(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [themeMode, setThemeMode] = useState('light');

  // Sync theme attribute to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const toggleCompare = (product) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 drones at a time.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(item.specs).some((val) =>
        val.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        cartTotal,
        cartItemCount,
        wishlist,
        toggleWishlist,
        compareList,
        toggleCompare,
        isCartOpen,
        setIsCartOpen,
        isCompareOpen,
        setIsCompareOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        themeMode,
        toggleTheme
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
