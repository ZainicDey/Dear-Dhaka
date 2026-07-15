"use client";

import { useState } from "react";

const mockCoupons = [
  {
    id: "1",
    code: "DEARDHAKA15",
    discountPercent: 15,
    discountAmount: null,
    maxUses: 100,
    usedCount: 43,
    expiryDate: "2026-08-31",
    isActive: true,
  },
  {
    id: "2",
    code: "YUMMY20",
    discountPercent: 20,
    discountAmount: null,
    maxUses: 50,
    usedCount: 12,
    expiryDate: "2026-07-31",
    isActive: true,
  },
  {
    id: "3",
    code: "FLAT50",
    discountPercent: null,
    discountAmount: 50,
    maxUses: 200,
    usedCount: 198,
    expiryDate: "2026-07-15",
    isActive: false,
  },
];

export default function Coupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showForm, setShowForm] = useState(false);

  const toggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add coupon button / form toggle */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-brand-yellow rounded-xl py-3.5 font-bold text-[#301010] text-[14px] cursor-pointer active:scale-[0.98] transition-transform"
      >
        {showForm ? "Cancel" : "+ Create New Coupon"}
      </button>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Coupon code (e.g. SAVE20)"
            className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010] placeholder:text-[#a3a3a3] uppercase tracking-wider"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Discount %"
              className="flex-1 bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010] placeholder:text-[#a3a3a3]"
            />
            <input
              type="number"
              placeholder="Max uses"
              className="flex-1 bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010] placeholder:text-[#a3a3a3]"
            />
          </div>
          <input
            type="date"
            className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010]"
          />
          <button className="w-full bg-brand-yellow rounded-xl py-3 font-bold text-[14px] text-[#301010] cursor-pointer active:scale-[0.98] transition-transform">
            Create Coupon
          </button>
        </div>
      )}

      {/* Coupons list */}
      {coupons.map((coupon) => {
        const usagePercent =
          coupon.maxUses > 0
            ? Math.round((coupon.usedCount / coupon.maxUses) * 100)
            : 0;
        const isExpired = new Date(coupon.expiryDate) < new Date();

        return (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
              coupon.isActive && !isExpired
                ? "border-[#e5e5e5]/50"
                : "border-red-200 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="bg-[#f4f3ed] rounded-lg px-3 py-1.5 w-fit mb-2">
                  <span className="text-[14px] font-extrabold text-[#301010] tracking-wider">
                    {coupon.code}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-[#301010]">
                  {coupon.discountPercent
                    ? `${coupon.discountPercent}% OFF`
                    : `৳${coupon.discountAmount} OFF`}
                </span>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleActive(coupon.id)}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer shrink-0 ${
                  coupon.isActive ? "bg-green-500" : "bg-[#d9d9d9]"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                    coupon.isActive ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Usage bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-[#737373]">
                  {coupon.usedCount}/{coupon.maxUses} used
                </span>
                <span className="text-[#737373]">
                  Expires: {coupon.expiryDate}
                </span>
              </div>
              <div className="w-full h-2 bg-[#f4f3ed] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent >= 90 ? "bg-red-400" : "bg-brand-yellow"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>

            {isExpired && (
              <div className="mt-2 text-[12px] font-semibold text-red-500">
                ⚠ Expired
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
