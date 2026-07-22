"use client";

import { useState, useEffect } from "react";
import { createMenuItem } from "@/actions/menu";
import { getCategories } from "@/actions/categories";
import { useRouter } from "next/navigation";

export default function AddItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    originalPrice: "",
    discountType: "",
    discountValue: "",
    description: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("originalPrice", formData.originalPrice);
    if (formData.discountType)
      data.append("discountType", formData.discountType);
    if (formData.discountValue)
      data.append("discountValue", formData.discountValue);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      await createMenuItem(data);
      alert("Item added successfully!");
      setFormData({
        name: "",
        originalPrice: "",
        discountType: "",
        discountValue: "",
        description: "",
        category: "",
      });
      setImageFile(null);
      setImagePreview(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add item");
    }
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

      {/* Price and Discount Row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
        <div className="flex-1">
          <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
            Original Price (৳)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            placeholder="150"
            className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
          />
        </div>
        <div className="flex-1">
          <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
            Discount Type
          </label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] cursor-pointer"
          >
            <option value="">None</option>
            <option value="FLAT">Flat (৳)</option>
            <option value="PERCENTAGE">Percentage (%)</option>
          </select>
        </div>
        {formData.discountType && (
          <div className="flex-1">
            <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
              {formData.discountType === "FLAT"
                ? "Discount (৳)"
                : "Discount (%)"}
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder={formData.discountType === "FLAT" ? "20" : "10"}
              className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
            />
          </div>
        )}
      </div>

      {/* Price Preview */}
      {formData.originalPrice && (
        <div className="text-[13px] text-[#737373] ml-1 mt-[-10px] mb-2 font-medium">
          Final Selling Price:{" "}
          <span className="text-green-600 font-extrabold text-[15px]">
            ৳
            {formData.discountType === "FLAT" && formData.discountValue
              ? Math.max(
                  0,
                  Number(formData.originalPrice) -
                    Number(formData.discountValue),
                )
              : formData.discountType === "PERCENTAGE" && formData.discountValue
                ? Math.max(
                    0,
                    Number(formData.originalPrice) -
                      (Number(formData.originalPrice) *
                        Number(formData.discountValue)) /
                        100,
                  )
                : formData.originalPrice}
          </span>
        </div>
      )}

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
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
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

      {/* Image Upload */}
      <div>
        <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
          Item Image
        </label>
        <label className="w-full bg-white rounded-xl py-8 px-4 border-2 border-dashed border-[#d9d9d9] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-yellow transition-colors relative overflow-hidden min-h-[120px]">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
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
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
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
