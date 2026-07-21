"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategoryOrder,
} from "@/actions/categories";

type Category = {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isPending, startTransition] = useTransition();
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleAdd = () => {
    const name = newCategory.trim();
    if (!name) return;
    setNewCategory("");

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      await createCategory(formData);
      const updated = await getCategories();
      setCategories(updated);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteCategory(id);
      const updated = await getCategories();
      setCategories(updated);
    });
  };

  // --- Drag & Drop ---

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIdx(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    // Make the dragged item semi-transparent after a frame
    requestAnimationFrame(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.4";
      }
    });
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIdx === null || index === draggedIdx) return;
    setOverIdx(index);
  };

  const handleDragEnd = () => {
    // Restore opacity
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }

    if (draggedIdx !== null && overIdx !== null && draggedIdx !== overIdx) {
      // Reorder locally
      const reordered = [...categories];
      const [moved] = reordered.splice(draggedIdx, 1);
      reordered.splice(overIdx, 0, moved);

      // Assign new order values
      const withNewOrder = reordered.map((cat, i) => ({
        ...cat,
        order: i,
      }));
      setCategories(withNewOrder);

      // Persist to DB
      const updates = withNewOrder.map((cat) => ({
        id: cat.id,
        order: cat.order,
      }));
      startTransition(async () => {
        await updateCategoryOrder(updates);
      });
    }

    setDraggedIdx(null);
    setOverIdx(null);
    dragNodeRef.current = null;
  };

  const handleDragLeave = () => {
    setOverIdx(null);
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
          disabled={isPending}
        />
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="bg-brand-yellow rounded-xl px-5 py-3 font-bold text-[14px] text-[#301010] cursor-pointer active:scale-95 transition-transform shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "..." : "Add"}
        </button>
      </div>

      {/* Categories list */}
      <div className="flex flex-col gap-2">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            className={`bg-white rounded-2xl px-4 py-3.5 shadow-sm border flex items-center gap-3 select-none transition-all duration-150 ${
              overIdx === index && draggedIdx !== null
                ? "border-brand-yellow ring-2 ring-brand-yellow/30 scale-[1.02]"
                : "border-[#e5e5e5]/50"
            }`}
          >
            {/* Drag handle */}
            <div className="text-[#d9d9d9] shrink-0 cursor-grab active:cursor-grabbing">
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
              disabled={isPending}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
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

        {categories.length === 0 && !isPending && (
          <div className="text-center py-8 text-[#a3a3a3] text-[14px]">
            No categories yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
