"use client";

import { useState, useEffect } from "react";
import { 
  getBanners, 
  createBanner, 
  toggleBanner, 
  deleteBanner, 
  reorderBanners,
  getCoupons
} from "@/actions/marketing";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableBannerItem({ banner, handleToggle, handleDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl p-4 shadow-sm border transition-colors ${
        banner.isActive ? "border-[#e5e5e5]/50" : "border-red-200 opacity-60"
      } ${isDragging ? "shadow-md ring-2 ring-brand-yellow/50 z-10 scale-[1.02]" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-center flex-1">
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            className="text-[#d9d9d9] shrink-0 cursor-grab active:cursor-grabbing hover:text-brand-yellow transition-colors touch-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.5" />
              <circle cx="15" cy="6" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="18" r="1.5" />
              <circle cx="15" cy="18" r="1.5" />
            </svg>
          </div>
          
          <div className="flex-1 flex items-center gap-4">
            {banner.imageUrl ? (
              <img src={banner.imageUrl} alt="Banner" className="h-16 w-24 object-cover rounded-lg" />
            ) : (
              <div className="h-16 w-24 bg-[#f4f3ed] rounded-lg flex items-center justify-center text-[#a3a3a3] text-[10px] font-bold tracking-wider">
                NO IMAGE
              </div>
            )}
            {banner.couponCode && (
              <div className="bg-brand-yellow/15 border border-brand-yellow/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#301010]/60">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span className="text-[13px] font-extrabold text-[#301010] tracking-wider uppercase">
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
      <div className="flex gap-2 mt-4 pt-3 border-t border-[#f4f3ed]">
        <button 
          onClick={() => handleDelete(banner.id)}
          className="w-full py-2 rounded-lg bg-red-50 text-[13px] font-semibold text-red-500 cursor-pointer hover:bg-red-100 active:scale-[0.98] transition-all"
        >
          Delete Banner
        </button>
      </div>
    </div>
  );
}

export default function AdBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchData = async () => {
    try {
      const [fetchedBanners, fetchedCoupons] = await Promise.all([
        getBanners(),
        getCoupons(),
      ]);
      setBanners(fetchedBanners);
      setCoupons(fetchedCoupons.filter((c: any) => c.isActive));
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex(b => b.id === active.id);
      const newIndex = banners.findIndex(b => b.id === over.id);

      const reordered = arrayMove(banners, oldIndex, newIndex);
      setBanners(reordered);
      
      try {
        await reorderBanners(reordered.map(b => b.id));
      } catch (error) {
        console.error("Failed to reorder", error);
        fetchData();
      }
    }
  };

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
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4">
          <SortableContext 
            items={banners.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {banners.map((banner) => (
              <SortableBannerItem 
                key={banner.id} 
                banner={banner} 
                handleToggle={handleToggle}
                handleDelete={handleDelete}
              />
            ))}
          </SortableContext>
          {banners.length === 0 && !loading && (
            <div className="text-center py-6 text-gray-500 text-[14px]">
              No banners created yet.
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}
