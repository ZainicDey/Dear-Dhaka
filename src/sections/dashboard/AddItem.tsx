"use client";

import { useState, useEffect } from "react";
import { createMenuItem } from "@/actions/menu";
import { getCategories } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import CustomSelect from "@/components/dashboard/CustomSelect";

export default function AddItem() {
  const router = useRouter();
  const { showAlert } = useAlert();
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
    if (!imageFile) {
      showAlert("Please upload an image");
      return;
    }
    const data = new FormData();
    data.append("name", formData.name);
    data.append("originalPrice", formData.originalPrice);
    if (formData.discountType)
      data.append("discountType", formData.discountType);
    if (formData.discountValue)
      data.append("discountValue", formData.discountValue);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", imageFile);

    try {
      await createMenuItem(data);
      showAlert("Item added successfully!");
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
      showAlert("Failed to add item");
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
          <CustomSelect
            name="discountType"
            value={formData.discountType}
            onChange={(val) => setFormData((prev) => ({ ...prev, discountType: val }))}
            placeholder="None"
            options={[
              { value: "", label: "None" },
              { value: "FLAT", label: "Flat (৳)" },
              { value: "PERCENTAGE", label: "Percentage (%)" },
            ]}
          />
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
              required={!!formData.discountType}
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

      <div>
        <label className="text-[13px] font-semibold text-[#301010] block mb-1.5 ml-1">
          Category
        </label>
        <CustomSelect
          name="category"
          value={formData.category}
          onChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
          placeholder="Select category"
          required
          options={[
            { value: "", label: "Select category" },
            ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
          ]}
        />
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
