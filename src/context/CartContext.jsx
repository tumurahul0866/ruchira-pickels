import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('vasuki_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('vasuki_cart', JSON.stringify(items));
  };

  const addToCart = (product, weightOption, quantity) => {
    const existingIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.weightOption.weight === weightOption.weight
    );

    let newCart = [...cartItems];
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, weightOption, quantity });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId, weight) => {
    const newCart = cartItems.filter(
      item => !(item.product.id === productId && item.weightOption.weight === weight)
    );
    saveCart(newCart);
  };

  const updateQuantity = (productId, weight, quantity) => {
    if (quantity <= 0) return removeFromCart(productId, weight);
    const newCart = cartItems.map(item => {
      if (item.product.id === productId && item.weightOption.weight === weight) {
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
