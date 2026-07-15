"use client";

import { useState } from "react";

const mockCategories = [
  { id: "1", name: "Breakfast Specials", order: 0 },
  { id: "2", name: "Lunch Menu", order: 1 },
  { id: "3", name: "Snacks Menu", order: 2 },
  { id: "4", name: "Combo", order: 3 },
];

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (!newCategory.trim()) return;
    setCategories((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newCategory.trim(),
        order: prev.length,
      },
    ]);
    setNewCategory("");
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add new category */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name..."
          className="flex-1 bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-brand-yellow rounded-xl px-5 py-3 font-bold text-[14px] text-[#301010] cursor-pointer active:scale-95 transition-transform shrink-0"
        >
          Add
        </button>
      </div>

      {/* Categories list */}
      <div className="flex flex-col gap-2">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-[#e5e5e5]/50 flex items-center gap-3"
          >
            {/* Drag handle */}
            <div className="text-[#d9d9d9] shrink-0 cursor-grab">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
            </div>

            {/* Order number */}
            <span className="text-[12px] font-bold text-[#a3a3a3] w-5 text-center shrink-0">
              {index + 1}
            </span>

            {/* Name */}
            <span className="flex-1 font-semibold text-[15px] text-[#301010]">
              {cat.name}
            </span>

            {/* Delete */}
            <button
              onClick={() => handleDelete(cat.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 cursor-pointer active:scale-95 transition-transform"
              aria-label={`Delete ${cat.name}`}
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
