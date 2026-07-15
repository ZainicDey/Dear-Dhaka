"use client";

import { useState } from "react";

const mockBanners = [
  {
    id: "1",
    title: "FLAT 15% OFF!",
    subtitle: "On direct Orders",
    couponCode: "DEARDHAKA15",
    isActive: true,
  },
  {
    id: "2",
    title: "FLAT 20% OFF!",
    subtitle: "On direct Orders",
    couponCode: "YUMMY20",
    isActive: true,
  },
  {
    id: "3",
    title: "FLAT 10% OFF!",
    subtitle: "On direct Orders",
    couponCode: "TASTY10",
    isActive: false,
  },
];

export default function AdBanners() {
  const [banners, setBanners] = useState(mockBanners);

  const toggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add banner button */}
      <button className="w-full bg-white rounded-2xl py-4 px-4 shadow-sm border-2 border-dashed border-[#d9d9d9] flex items-center justify-center gap-2 cursor-pointer hover:border-brand-yellow transition-colors active:scale-[0.98]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-[14px] font-semibold text-[#a3a3a3]">
          Add New Banner
        </span>
      </button>

      {/* Banner cards */}
      {banners.map((banner) => (
        <div
          key={banner.id}
          className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
            banner.isActive
              ? "border-[#e5e5e5]/50"
              : "border-red-200 opacity-60"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="font-extrabold text-[16px] text-[#301010] block">
                {banner.title}
              </span>
              <span className="text-[13px] text-[#737373] block mt-0.5">
                {banner.subtitle}
              </span>
              {banner.couponCode && (
                <div className="mt-2 bg-brand-yellow/15 rounded-lg px-3 py-1.5 w-fit">
                  <span className="text-[12px] font-bold text-[#301010] tracking-wider">
                    {banner.couponCode}
                  </span>
                </div>
              )}
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggleActive(banner.id)}
              className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer shrink-0 ml-3 ${
                banner.isActive ? "bg-green-500" : "bg-[#d9d9d9]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  banner.isActive ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Actions row */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#f4f3ed]">
            <button className="flex-1 py-2 rounded-lg bg-[#f4f3ed] text-[13px] font-semibold text-[#301010] cursor-pointer active:scale-[0.98] transition-transform">
              Edit
            </button>
            <button className="flex-1 py-2 rounded-lg bg-red-50 text-[13px] font-semibold text-red-500 cursor-pointer active:scale-[0.98] transition-transform">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
