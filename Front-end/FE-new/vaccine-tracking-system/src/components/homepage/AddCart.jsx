import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (vaccine) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[vaccine.vaccineId]) {
        updatedCart[vaccine.vaccineId].doseNumber += vaccine.doseNumber;
      } else {
        updatedCart[vaccine.vaccineId] = { ...vaccine };
      }
      return updatedCart;
    });
  };

  const removeFromCart = (vaccineId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[vaccineId];
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
