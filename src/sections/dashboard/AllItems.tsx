"use client";

import { useState } from "react";

// Temporary mock data — will be replaced by server action fetch
const mockItems = [
  {
    id: "1",
    name: "Chicken Shingara",
    price: 120,
    originalPrice: 140,
    category: "Breakfast Specials",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Egg Noodles",
    price: 140,
    originalPrice: 175,
    category: "Breakfast Specials",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Paratha Platter",
    price: 99,
    originalPrice: 120,
    category: "Lunch Menu",
    isAvailable: false,
  },
  {
    id: "4",
    name: "Chicken Roll",
    price: 80,
    originalPrice: 100,
    category: "Snacks Menu",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Combo Meal",
    price: 250,
    originalPrice: 320,
    category: "Combo",
    isAvailable: true,
  },
];

export default function AllItems() {
  const [items] = useState(mockItems);

  return (
    <div className="flex flex-col gap-3">
      {/* Quick stats */}
      <div className="flex gap-3 mb-2">
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50">
          <span className="text-[24px] font-extrabold text-[#301010] block leading-none">
            {items.length}
          </span>
          <span className="text-[12px] text-[#737373] mt-1 block">
            Total Items
          </span>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50">
          <span className="text-[24px] font-extrabold text-green-600 block leading-none">
            {items.filter((i) => i.isAvailable).length}
          </span>
          <span className="text-[12px] text-[#737373] mt-1 block">
            Available
          </span>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50">
          <span className="text-[24px] font-extrabold text-red-500 block leading-none">
            {items.filter((i) => !i.isAvailable).length}
          </span>
          <span className="text-[12px] text-[#737373] mt-1 block">
            Unavailable
          </span>
        </div>
      </div>

      {/* Items list */}
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 flex items-center gap-3"
        >
          {/* Availability dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              item.isAvailable ? "bg-green-500" : "bg-red-400"
            }`}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <span className="font-bold text-[15px] text-[#301010] block truncate">
              {item.name}
            </span>
            <span className="text-[12px] text-[#737373]">{item.category}</span>
          </div>

          {/* Prices */}
          <div className="flex flex-col items-end shrink-0">
            <span className="font-extrabold text-[15px] text-[#301010]">
              ৳{item.price}
            </span>
            {item.originalPrice > item.price && (
              <span className="text-[11px] text-[#a3a3a3] line-through">
                ৳{item.originalPrice}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 shrink-0">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f4f3ed] cursor-pointer active:scale-95 transition-transform"
              aria-label="Edit item"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#301010"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 cursor-pointer active:scale-95 transition-transform"
              aria-label="Delete item"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
