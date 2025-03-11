import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  // them vao gio hang
  const addToCart = (vaccine) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[vaccine.vaccineId]) {
        updatedCart[vaccine.vaccineId].quantity += 1;
      } else {
        updatedCart[vaccine.vaccineId] = { ...vaccine, quantity: 1 };
      }
      return updatedCart;
    });
  };

  // xoa khoi gio hang
  const removeFromCart = (vaccineId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[vaccineId] && updatedCart[vaccineId].quantity > 1) {
        updatedCart[vaccineId].quantity -= 1;
      } else {
        delete updatedCart[vaccineId];
      }

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
