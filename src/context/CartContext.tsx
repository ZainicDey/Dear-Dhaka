"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MenuItem } from "@/sections/Items";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  label: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  totalItems: number;
  subtotal: number;
  totalOriginalPrice: number;
  discount: number;
  couponDiscount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on initial mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("dd_cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem("dd_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Error loading cart from local storage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever cart or coupon changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dd_cart", JSON.stringify(cartItems));
      if (appliedCoupon) {
        localStorage.setItem("dd_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("dd_coupon");
      }
    }
  }, [cartItems, appliedCoupon, isLoaded]);

  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((i) => {
          if (i.id === itemId) {
            return { ...i, quantity: Math.max(0, i.quantity + delta) };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const applyCoupon = (coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalOriginalPrice = cartItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  
  const discount = Math.round(subtotal * 0.2); 
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        subtotal,
        totalOriginalPrice,
        discount,
        couponDiscount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

