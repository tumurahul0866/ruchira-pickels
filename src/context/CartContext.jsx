/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

const getItemKey = (product, weightOption) => `${product.id}::${weightOption?.weight ?? 'unit'}`;

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    ...item,
    itemKey: item.itemKey || getItemKey(item.product, item.weightOption),
  }));
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    const savedCart = localStorage.getItem('vasuki_cart');
    return savedCart ? normalizeCartItems(JSON.parse(savedCart)) : [];
  });

  const saveCart = (items) => {
    const normalizedItems = normalizeCartItems(items);
    setCartItems(normalizedItems);
    localStorage.setItem('vasuki_cart', JSON.stringify(normalizedItems));
  };

  const addToCart = (product, weightOption, quantity) => {
    const itemKey = `${product.id}::${weightOption.weight}`;
    const existingIndex = cartItems.findIndex(
      item => item.itemKey === itemKey
    );

    let newCart = [...cartItems];
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ itemKey, product, weightOption, quantity });
    }
    saveCart(newCart);
  };

  const removeFromCart = (itemKey) => {
    const newCart = cartItems.filter(item => item.itemKey !== itemKey);
    saveCart(newCart);
  };

  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) return removeFromCart(itemKey);
    const newCart = cartItems.map(item => {
      if (item.itemKey === itemKey) {
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
