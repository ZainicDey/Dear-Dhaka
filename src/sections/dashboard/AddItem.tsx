"use client";

import { useState } from "react";

export default function AddItem() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call server action
    console.log("Submit:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Item Name */}
      <div>
        <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
          Item Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Chicken Shingara"
          className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
        />
      </div>

      {/* Price Row */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
            Price (৳)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="120"
            className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
          />
        </div>
        <div className="flex-1">
          <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
            Original Price (৳)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            placeholder="140"
            className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] cursor-pointer"
        >
          <option value="">Select category</option>
          <option value="Breakfast Specials">Breakfast Specials</option>
          <option value="Lunch Menu">Lunch Menu</option>
          <option value="Snacks Menu">Snacks Menu</option>
          <option value="Combo">Combo</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the item..."
          rows={3}
          className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3] resize-none"
        />
      </div>

      {/* Image Upload Placeholder */}
      <div>
        <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
          Item Image
        </label>
        <div className="w-full bg-white rounded-xl py-8 px-4 border-2 border-dashed border-[#d9d9d9] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-yellow transition-colors">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-[13px] text-[#a3a3a3]">
            Tap to upload image
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-brand-yellow rounded-xl py-3.5 font-bold text-[#301010] text-[15px] shadow-sm cursor-pointer active:scale-[0.98] transition-transform mt-2"
      >
        Add Item
      </button>
    </form>
  );
}
