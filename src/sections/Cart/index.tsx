"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/actions/order";
import { validateCoupon } from "@/actions/marketing";
import { useAlert } from "@/context/AlertContext";

import LocationIcon from "@/assets/images/Locaion.png";
import TrashIcon from "@/assets/images/Remove-trash.png";
import PlusBlackIcon from "@/assets/images/Plus-black.svg";
import PlusYellowIcon from "@/assets/images/Plus-yellow.svg";
import CancelIcon from "@/assets/images/Cancel.svg";
import SearchIcon from "@/assets/images/Search.png";
import MockItemImage from "@/assets/images/Mock-item-image1.png"; // We use this for all for now, or use item.image if available

const WHATSAPP_NUMBER = "8801752677486";

export default function CartSection() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "checking" | "invalid" | "applied"
  >(appliedCoupon ? "applied" : "idle");
  const [couponError, setCouponError] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync applied coupon state on mount
  useEffect(() => {
    if (appliedCoupon) {
      setCouponCode(appliedCoupon.code);
      setCouponStatus("applied");
    }
  }, [appliedCoupon]);

  // Debounced coupon validation – triggers 1 second after the user stops typing
  const handleCouponInput = (value: string) => {
    setCouponCode(value);
    setCouponError("");

    // If already applied, changing the text should remove the coupon
    if (couponStatus === "applied") {
      removeCoupon();
      setCouponStatus("idle");
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const trimmed = value.trim();
    if (!trimmed) {
      setCouponStatus("idle");
      return;
    }

    setCouponStatus("checking");

    debounceTimer.current = setTimeout(async () => {
      try {
        const result = await validateCoupon(trimmed, subtotal);
        if (result.valid) {
          applyCoupon({
            code: result.code!,
            discountAmount: result.discountAmount!,
            label: result.label!,
          });
          setCouponStatus("applied");
          setCouponError("");
        } else {
          setCouponStatus("invalid");
          setCouponError(result.error || "Invalid coupon");
        }
      } catch {
        setCouponStatus("invalid");
        setCouponError("Failed to validate coupon");
      }
    }, 1000);
  };

  const discountPercent =
    subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return;

    if (!address.trim()) {
      setAddressError(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderId = await createOrder({
        subtotal,
        discount: discount + couponDiscount,
        couponCode: appliedCoupon?.code,
        couponDiscount: couponDiscount,
        total,
        address,
        deliveryInstructions,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      const itemLines = cartItems
        .map(
          (item) =>
            `${item.name} x${item.quantity} = ৳${item.price * item.quantity}`,
        )
        .join("\n");

      const deliveryArea = address;

      const message = [
        `order_id: #${orderId}`,
        "Hi Dear Dhaka!",
        "I'd like to order:",
        "",
        itemLines,
        "",
        `Sub-total = ৳${subtotal}`,
        `Direct Order Discount (${discountPercent}%) = ৳${discount}`,
        ...(appliedCoupon
          ? [`Coupon (${appliedCoupon.code}) = -৳${couponDiscount}`]
          : []),
        `Delivery = Free (${deliveryArea})`,
        "",
        `Total = ৳${total}`,
        "",
        `Address: ${address}${deliveryInstructions ? `, ${deliveryInstructions}` : ""}`,
      ].join("\n");

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Failed to create order:", error);
      showAlert("Something went wrong while confirming your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative pb-24 tracking-tight">
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
      <div className="px-5 mb-5">
        <div className="bg-white rounded-[24px] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1 ml-3">
            <Image src={LocationIcon} alt="Location" width={26} height={26} />
            <span className="font-normal text-[17px] text-[#301010]">
              Delivery Address
            </span>
          </div>

          <div className="relative mb-3">
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
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (addressError) setAddressError(false);
              }}
              className={`w-full bg-[#f4f3ed] rounded-4xl py-3 pl-12 pr-4 text-[13px] outline-none placeholder:text-gray-400 text-[#301010] ${
                addressError ? "border border-red-500" : ""
              }`}
            />
          </div>

          {addressError && (
            <p className="text-red-500 text-[12px] ml-5 -mt-2 mb-3">
              Delivery address is required.
            </p>
          )}

          <div>
            <span className="text-[14px] ml-5 text-[#301010] block mb-1">
              Delivery Instructions
            </span>
            <input
              type="text"
              placeholder="(Optional) Floor/Apt No or tell us how we can find you..."
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="w-full bg-[#f4f3ed] rounded-[24px] py-3 px-4 text-[13px] outline-none placeholder:text-gray-400 text-[#301010]"
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
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Image
                  src={MockItemImage}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col relative">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[18px] text-[#301010]">
                  {item.name}
                </span>
                <div className="flex flex-col mr-5 items-end">
                  <span className="font-extrabold text-[18px] text-[#301010]">
                    ৳{item.price}
                  </span>
                  {item.originalPrice > item.price && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {item.discountType && item.discountValue && (
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          -{item.discountType === 'PERCENTAGE' ? `${item.discountValue}%` : `৳${item.discountValue}`}
                        </span>
                      )}
                      <span className="text-[12px] text-gray-400 line-through">
                        ৳{item.originalPrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 -mt-5 border border-gray-200 rounded-full w-fit px-2 py-0.5">
                <button
                  onClick={() =>
                    item.quantity === 1
                      ? removeFromCart(item.id)
                      : updateQuantity(item.id, -1)
                  }
                  className="flex items-center justify-center cursor-pointer min-w-[20px]"
                >
                  {item.quantity === 1 ? (
                    <Image
                      src={TrashIcon}
                      alt="Remove"
                      width={18}
                      height={18}
                    />
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#301010"
                      strokeWidth="4.5"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    >
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
      <div className="pt-6 pb-4 bg-brand-white-dark mt-4 flex-col justify-center leading-none">
        <div className="flex justify-between mb-2">
          <span className="ml-12 text-[17px] text-[#301010]">Subtotal</span>
          <span className="mr-10 font-bold text-[17px] text-[#301010]">
            ৳{subtotal}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="ml-12 text-[17px] text-[#301010]">
            Direct Order Discount
          </span>
          <span className="mr-10 font-bold text-[17px] text-[#301010]">
            -৳{discount}
          </span>
        </div>

        {/* Coupon Discount Line */}
        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex justify-between mb-2">
            <span className="ml-12 text-[17px] text-green-600">
              Coupon ({appliedCoupon.code})
            </span>
            <span className="mr-10 font-bold text-[17px] text-green-600">
              -৳{couponDiscount}
            </span>
          </div>
        )}

        <div className="flex justify-between mb-4">
          <span className="ml-12 text-[17px] text-[#301010]">
            Delivery Charge (Free)
          </span>
          <span className="mr-10 font-bold text-[17px] text-[#301010]">৳0</span>
        </div>

        {/* Custom line below Delivery Charge */}
        <div className="border-b-[1.5px] border-[#e5e5e5] mb-4 ml-4 mr-4"></div>
        <div className="flex justify-between mb-2">
          <span className="ml-12 font-extrabold text-[17px] text-[#301010]">
            Total
          </span>
          <span className="mr-10 font-extrabold text-[17px] text-[#301010]">
            ৳{total}
          </span>
        </div>
      </div>

      {/* Coupon Input */}
      <div className="px-5 mb-8">
        <div className="bg-brand-white-dark mt-5 rounded-full flex items-center px-4 py-3 shadow-sm border border-gray-100 relative">
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
            value={couponCode}
            onChange={(e) => handleCouponInput(e.target.value)}
            className="flex-1 bg-transparent text-[14px] outline-none text-[#301010] placeholder:text-[#767676] uppercase disabled:opacity-60"
          />

          {/* Status indicators */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {couponStatus === "checking" && (
              <svg className="animate-spin h-5 w-5 text-[#737373]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}

            {couponStatus === "invalid" && (
              <div className="bg-red-100 text-red-500 rounded-full w-6 h-6 flex items-center justify-center font-extrabold text-[14px]">
                !
              </div>
            )}
          </div>
        </div>

        {/* Error / Success messages */}
        {couponStatus === "invalid" && couponError && (
          <p className="text-red-500 text-[12px] mt-1.5 ml-4">{couponError}</p>
        )}
        {couponStatus === "applied" && appliedCoupon && (
          <p className="text-green-600 text-[12px] mt-1.5 ml-4 font-semibold">
            🎉 Coupon {appliedCoupon.code} applied — ৳{couponDiscount} off!
          </p>
        )}
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-5 flex justify-center bg-[#F4F3ED]/90 backdrop-blur-md z-50">
        <button
          onClick={handleConfirmOrder}
          disabled={cartItems.length === 0 || isSubmitting}
          className="w-full max-w-[448px] bg-brand-yellow rounded-xl py-4 font-bold text-[#301010] text-[16px] shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-[#301010]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Confirming...
            </span>
          ) : (
            "Confirm Order"
          )}
        </button>
      </div>
    </div>
  );
}

