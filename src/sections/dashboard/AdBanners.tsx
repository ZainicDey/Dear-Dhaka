"use client";

import { useState, useRef, useEffect } from "react";
import { 
  getBanners, 
  createBanner, 
  toggleBanner, 
  deleteBanner, 
  reorderBanners,
  getCoupons
} from "@/actions/marketing";

export default function AdBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    try {
      const [fetchedBanners, fetchedCoupons] = await Promise.all([
        getBanners(),
        getCoupons(),
      ]);
      setBanners(fetchedBanners);
      setCoupons(fetchedCoupons.filter((c: any) => c.isActive)); // Only active coupons for selection
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    try {
      await toggleBanner(id);
      fetchData();
    } catch (error) {
      console.error("Error toggling banner:", error);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createBanner(formData);
      setShowForm(false);
      setPreviewImage(null);
      fetchData();
    } catch (error) {
      console.error("Error creating banner:", error);
      alert("Failed to create banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    requestAnimationFrame(() => {
      if (dragNodeRef.current) dragNodeRef.current.style.opacity = "0.4";
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIdx === null || index === draggedIdx) return;
    setOverIdx(index);
  };

  const handleDragEnd = async () => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = "1";
    if (draggedIdx !== null && overIdx !== null && draggedIdx !== overIdx) {
      const reordered = [...banners];
      const [moved] = reordered.splice(draggedIdx, 1);
      reordered.splice(overIdx, 0, moved);
      setBanners(reordered);
      
      try {
        await reorderBanners(reordered.map(b => b.id));
      } catch (error) {
        console.error("Failed to reorder", error);
        fetchData();
      }
    }
    setDraggedIdx(null);
    setOverIdx(null);
    dragNodeRef.current = null;
  };

  const handleDragLeave = () => setOverIdx(null);

  if (loading) {
    return <div className="text-center py-4">Loading banners...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add banner button / form toggle */}
      <button 
        onClick={() => {
          setShowForm(!showForm);
          setPreviewImage(null);
        }}
        className="w-full bg-white rounded-2xl py-4 px-4 shadow-sm border-2 border-dashed border-[#d9d9d9] flex items-center justify-center gap-2 cursor-pointer hover:border-brand-yellow transition-colors active:scale-[0.98]"
      >
        {!showForm ? (
          <>
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
          </>
        ) : (
          <span className="text-[14px] font-semibold text-[#a3a3a3]">Cancel</span>
        )}
      </button>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-bold text-[#301010] block mb-2">
              Banner Image
            </label>
            {previewImage && (
              <img src={previewImage} alt="Preview" className="w-full h-32 object-cover rounded-xl mb-3" />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[13px] outline-none text-[#301010]"
            />
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#301010] block mb-2">
              Link Coupon (Optional)
            </label>
            <select
              name="couponCode"
              className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[13px] outline-none text-[#301010]"
            >
              <option value="">No Coupon</option>
              {coupons.map(coupon => (
                <option key={coupon.id} value={coupon.code}>
                  {coupon.code} ({coupon.discountPercent ? `${coupon.discountPercent}%` : `৳${coupon.discountAmount}`} OFF)
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-brand-yellow rounded-xl py-3.5 font-bold text-[14px] text-[#301010] cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {isSubmitting ? "Uploading..." : "Save Banner"}
          </button>
        </form>
      )}

      {/* Banner cards */}
      <div className="flex flex-col gap-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
              banner.isActive ? "border-[#e5e5e5]/50" : "border-red-200 opacity-60"
            } ${
              overIdx === index && draggedIdx !== null
                ? "border-brand-yellow ring-2 ring-brand-yellow/30 scale-[1.02]"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                {/* Drag Handle */}
                <div className="text-[#d9d9d9] shrink-0 cursor-grab active:cursor-grabbing self-center mr-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5" />
                    <circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" />
                    <circle cx="15" cy="18" r="1.5" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt="Banner" className="h-16 object-cover rounded-lg mb-2" />
                  ) : (
                    <div className="h-16 w-32 bg-[#f4f3ed] rounded-lg mb-2 flex items-center justify-center text-[#a3a3a3] text-[10px] font-bold tracking-wider">
                      NO IMAGE
                    </div>
                  )}
                  {banner.couponCode && (
                    <div className="mt-2 bg-brand-yellow/15 border border-brand-yellow/30 rounded-lg px-2.5 py-1 w-fit">
                      <span className="text-[12px] font-extrabold text-[#301010] tracking-wider">
                        {banner.couponCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={() => handleToggle(banner.id)}
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
              <button 
                onClick={() => handleDelete(banner.id)}
                className="w-full py-2 rounded-lg bg-red-50 text-[13px] font-semibold text-red-500 cursor-pointer hover:bg-red-100 active:scale-[0.98] transition-all"
              >
                Delete Banner
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && !loading && (
          <div className="text-center py-6 text-gray-500 text-[14px]">
            No banners created yet.
          </div>
        )}
      </div>
    </div>
  );
}
