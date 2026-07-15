"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartStickyButton() {
  const { totalItems, subtotal, totalOriginalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-1 left-0 right-0 px-4 z-50 flex justify-center">
      <Link
        href="/cart"
        className="w-full max-w-[448px] bg-brand-yellow rounded-[24px] py-3 px-5 flex items-center justify-between shadow-lg"
      >
        {/* Left: Item Count */}
        <div className="w-10 h-10 rounded-full border-1 border-black flex items-center justify-center">
          <span className="font-bold text-[22px] text-[#301010]">
            {totalItems}
          </span>
        </div>

        {/* Center: Text */}
        <div className="flex flex-col items-center justify-center flex-1 mx-2">
          <span className="font-bold text-[15px] text-[#301010] leading-none">
            View your cart
          </span>
          <span className="text-[14px] font-medium text-[#301010] leading-none mt-[2px]">
            Dear Dhaka
          </span>
        </div>

        {/* Right: Price */}
        <div className="flex flex-col items-end justify-center w-14">
          <span className="font-extrabold text-[17px] text-[#301010] leading-tight">
            ৳{subtotal}
          </span>
          {totalOriginalPrice > subtotal && (
            <span className="text-[15px] mr-0.5 mt-0.5 text-[#301010] line-through font-medium relative -mt-1 leading-tight">
              ৳{totalOriginalPrice}
              <div className="absolute top-1/2 left-2 right-0 h-[1px] bg-gray-500/50"></div>
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
