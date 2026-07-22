"use client";

import { useState, useEffect } from "react";
import { updateMenuItem, toggleMenuItemAvailability } from "@/actions/menu";
import { getCategories } from "@/actions/categories";

export default function EditItemModal({ 
  item, 
  onClose, 
  onSuccess 
}: { 
  item: any; 
  onClose: () => void; 
  onSuccess: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: item.name || "",
    originalPrice: item.originalPrice ? String(item.originalPrice) : "",
    discountType: item.discountType || "",
    discountValue: item.discountValue ? String(item.discountValue) : "",
    description: item.description || "",
    category: item.category || "",
  });
  
  const [isAvailable, setIsAvailable] = useState(item.isAvailable ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item.image || null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("originalPrice", formData.originalPrice);
    if (formData.discountType) data.append("discountType", formData.discountType);
    if (formData.discountValue) data.append("discountValue", formData.discountValue);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      await updateMenuItem(item.id, data);
      
      // If availability changed, update it too
      if (isAvailable !== item.isAvailable) {
        await toggleMenuItemAvailability(item.id);
      }
      
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#faf9f6] w-full max-w-lg rounded-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e5e5e5]">
          <h2 className="text-[18px] font-extrabold text-[#301010]">Edit Item</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f3ed] hover:bg-[#e5e5e5] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#301010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-5">
          <form id="edit-item-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Availability Toggle removed as per user request */}

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
                required
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
                  required
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
                    {formData.discountType === "FLAT" ? "Discount (৳)" : "Discount (%)"}
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={formData.discountType === "FLAT" ? "20" : "10"}
                    required={!!formData.discountType}
                    className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
                  />
                </div>
              )}
            </div>

            {/* Price Preview */}
            {formData.originalPrice && (
              <div className="text-[13px] text-[#737373] ml-1 mt-[-10px] mb-2 font-medium">
                Final Selling Price: <span className="text-green-600 font-extrabold text-[15px]">৳
                {formData.discountType === "FLAT" && formData.discountValue
                  ? Math.max(0, Number(formData.originalPrice) - Number(formData.discountValue))
                  : formData.discountType === "PERCENTAGE" && formData.discountValue
                  ? Math.max(0, Number(formData.originalPrice) - (Number(formData.originalPrice) * Number(formData.discountValue)) / 100)
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
                required
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
                required
                className="w-full bg-white rounded-xl py-3 px-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3] resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
                Item Image (Leave empty to keep current)
              </label>
              <label className="w-full bg-white rounded-xl py-8 px-4 border-2 border-dashed border-[#d9d9d9] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-yellow transition-colors relative overflow-hidden min-h-[120px]">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-[13px] text-[#a3a3a3]">
                      Tap to upload new image
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
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#e5e5e5] bg-white">
          <button
            type="submit"
            form="edit-item-form"
            disabled={loading}
            className="w-full bg-brand-yellow rounded-xl py-3.5 font-bold text-[#301010] text-[15px] shadow-sm cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
