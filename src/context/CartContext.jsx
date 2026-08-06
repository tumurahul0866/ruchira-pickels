/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    const savedCart = localStorage.getItem('vasuki_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('vasuki_cart', JSON.stringify(items));
  };

  const getCartItemKey = (product, weightOption) => {
    if (product.pricePerUnit) {
      return `${product.id}::${product.quantityType || 'Unit'}`;
    }
    return `${product.id}::${weightOption.weight}`;
  };

  const addToCart = (product, weightOption, quantity) => {
    const itemKey = getCartItemKey(product, weightOption);
    const existingIndex = cartItems.findIndex(
      item => getCartItemKey(item.product, item.weightOption) === itemKey
    );

    let newCart = [...cartItems];
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, weightOption, quantity });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId, weightOptionOrType) => {
    const newCart = cartItems.filter((item) => {
      const key = getCartItemKey(item.product, item.weightOption);
      const matchKey = item.product.pricePerUnit
        ? `${productId}::${item.product.quantityType || 'Unit'}`
        : `${productId}::${weightOptionOrType}`;
      return key !== matchKey;
    });
    saveCart(newCart);
  };

  const updateQuantity = (productId, weightOptionOrType, quantity) => {
    if (quantity <= 0) return removeFromCart(productId, weightOptionOrType);
    const newCart = cartItems.map((item) => {
      const key = getCartItemKey(item.product, item.weightOption);
      const matchKey = item.product.pricePerUnit
        ? `${productId}::${item.product.quantityType || 'Unit'}`
        : `${productId}::${weightOptionOrType}`;
      if (key === matchKey) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.weightOption.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
