import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (vaccine) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };

      // Kiểm tra nếu vaccine đã có trong giỏ hàng
      if (updatedCart[vaccine.vaccineId]) {
        // Nếu có, tăng số lượng (quantity)
        updatedCart[vaccine.vaccineId].quantity += 1;
      } else {
        // Nếu chưa có, thêm vaccine mới vào giỏ hàng và set số lượng = 1
        updatedCart[vaccine.vaccineId] = { ...vaccine, quantity: 1 };
      }

      return updatedCart;
    });
  };

  const removeFromCart = (vaccineId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };

      // Nếu vaccine đã có trong giỏ hàng và số lượng lớn hơn 1, giảm số lượng đi 1
      if (updatedCart[vaccineId] && updatedCart[vaccineId].quantity > 1) {
        updatedCart[vaccineId].quantity -= 1;
      } else {
        // Nếu số lượng là 1 hoặc không còn vaccine này, xóa khỏi giỏ hàng
        delete updatedCart[vaccineId];
      }

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart({}); // Xóa toàn bộ giỏ hàng
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
