"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import LocationIcon from "@/assets/images/Locaion.png";
import TrashIcon from "@/assets/images/Remove-trash.png";
import PlusBlackIcon from "@/assets/images/Plus-black.svg";
import PlusYellowIcon from "@/assets/images/Plus-yellow.svg";
import CancelIcon from "@/assets/images/Cancel.svg";
import SearchIcon from "@/assets/images/Search.png";
import MockItemImage from "@/assets/images/Mock-item-image1.png"; // We use this for all for now, or use item.image if available

export default function CartSection() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    total,
  } = useCart();

  return (
    <div className="flex flex-col min-h-screen relative pb-24">
      {/* Header */}
      <div className="flex items-center px-5 pt-11 pb-6">
        <Link
          href="/"
          className="mt-0.5 cursor-pointer flex items-center justify-center"
        >
          <Image src={CancelIcon} alt="Cancel" width={16} height={16} />
        </Link>
        <h1 className="text-[20px] font-extrabold ml-8 text-brand">Cart</h1>
      </div>

      {/* Address Card */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-[24px] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 ml-3">
            <Image src={LocationIcon} alt="Location" width={28} height={28} />
            <span className="font-normal text-[19px] text-[#301010]">
              Delivery Address
            </span>
          </div>

          <div className="relative mb-4">
            <div className="absolute left-4.5 top-1/2 -translate-y-1/2">
              <Image
                src={SearchIcon}
                alt="Search"
                className="w-5 h-5 opacity-60"
              />
            </div>
            <input
              type="text"
              placeholder="Enter Address"
              className="w-full bg-[#f4f3ed] rounded-4xl py-3 pl-12 pr-4 text-[13px] outline-none placeholder:text-gray-400 text-[#301010]"
            />
          </div>

          <div>
            <span className="text-[14px] ml-5 text-[#301010] block mb-2">
              Delivery Instructions
            </span>
            <input
              type="text"
              placeholder="(Optional) Floor/Apt No or tell us how we can find you..."
              className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[13px] outline-none placeholder:text-gray-400 text-[#301010]"
            />
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="bg-brand-white-dark px-5 py-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 mb-5 border-b border-[#737373]/25 pb-5 last:border-b-0 last:pb-0"
          >
            {/* Image */}
            <div className="w-16 h-16 shrink-0">
              <Image
                src={MockItemImage}
                alt={item.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[18px] text-[#301010]">
                  {item.name}
                </span>
                <div className="flex flex-col items-end">
                  <span className="font-extrabold text-[18px] text-[#301010]">
                    ৳{item.price}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-[12px] text-gray-400 line-through">
                      ৳{item.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 -mt-4 border border-gray-200 rounded-full w-fit px-2 py-1">
                <button
                  onClick={() =>
                    item.quantity === 1
                      ? removeFromCart(item.id)
                      : updateQuantity(item.id, -1)
                  }
                  className="flex items-center justify-center cursor-pointer min-w-[20px]"
                >
                  {item.quantity === 1 ? (
                    <Image src={TrashIcon} alt="Remove" width={18} height={18} />
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#301010" strokeWidth="4.5" strokeLinecap="square" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  )}
                </button>
                <span className="font-bold text-[16px] w-4 text-center text-[#301010]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="items-center ml-1 justify-center cursor-pointer"
                >
                  <Image src={PlusBlackIcon} alt="Add" width={13} height={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {cartItems.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Your cart is empty
          </div>
        )}

        {/* Add More Items */}
        <Link href="/">
          <div className="flex items-center gap-2 leading-none -mt-2 ml-1 cursor-pointer pt-2">
            <Image src={PlusBlackIcon} alt="Add more" width={16} height={16} />
            <span className="font-normal text-[16px] ml-2 text-[#301010]">
              Add More Items
            </span>
          </div>
        </Link>
      </div>

      {/* Summary */}
      <div className="px-12 pt-6 pb-4 bg-brand-white-dark mt-4 flex-col justify-center leading-none">
        <div className="flex justify-between mb-2">
          <span className="text-[17px] text-[#301010]">Subtotal</span>
          <span className="font-bold text-[17px] text-[#301010]">
            ৳{subtotal}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-[17px] text-[#301010]">
            Direct Order Discount
          </span>
          <span className="font-bold text-[17px] text-[#301010]">
            -৳{discount}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-[17px] text-[#301010]">
            Delivery Charge (Free)
          </span>
          <span className="font-bold text-[17px] text-[#301010]">৳0</span>
        </div>
        
        {/* Custom line below Delivery Charge */}
        <div className="border-b-[1.5px] border-[#e5e5e5] mb-4 -mx-8"></div>
        <div className="flex justify-between mb-2">
          <span className="font-extrabold text-[17px] text-[#301010]">
            Total
          </span>
          <span className="font-extrabold text-[17px] text-[#301010]">
            ৳{total}
          </span>
        </div>
      </div>

      {/* Coupon */}
      <div className="px-5 mb-8">
        <div className="bg-brand-white-dark mt-5 rounded-full flex items-center px-4 py-3 shadow-sm border border-gray-100">
          <Image
            src={PlusYellowIcon}
            alt="Coupon"
            width={20}
            height={20}
            className="mr-4"
          />
          <input
            type="text"
            placeholder="Apply Coupon Code"
            className="flex-1 bg-transparent text-[14px] outline-none text-[#301010] placeholder:text-[#767676]"
          />
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-5 flex justify-center bg-[#F4F3ED]/90 backdrop-blur-md z-50">
        <button className="w-full max-w-[448px] bg-brand-yellow rounded-xl py-4 font-bold text-[#301010] text-[16px] shadow-sm cursor-pointer">
          Confirm Order
        </button>
      </div>
    </div>
  );
}
