"use client";

import { useState, useEffect } from "react";
import { getMenuItems, toggleMenuItemAvailability, deleteMenuItem } from "@/actions/menu";
import EditItemModal from "./EditItemModal";

export default function AllItems() {
  // Use any to quickly bypass type errors since we don't have the Prisma types exported directly here, or we can just omit type
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const fetchItems = async () => {
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggle = async (id: string) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    try {
      await toggleMenuItemAvailability(id);
      // Fetch again to ensure sync
      fetchItems();
    } catch (error) {
      console.error("Error toggling availability:", error);
      // Revert on error by refetching
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteMenuItem(id);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading items...</div>;
  }

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
          className={`bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 flex items-center gap-3 transition-opacity ${
            !item.isAvailable ? "opacity-75" : ""
          }`}
        >
          {/* Availability Toggle Switch */}
          <button
            onClick={() => handleToggle(item.id)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              item.isAvailable ? 'bg-green-500' : 'bg-gray-300'
            }`}
            title={item.isAvailable ? "Mark Unavailable" : "Mark Available"}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                item.isAvailable ? 'translate-x-[18px]' : 'translate-x-1'
              }`}
            />
          </button>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <span className="font-bold text-[15px] text-[#301010] block truncate">
              {item.name} {!item.isAvailable && <span className="text-red-500 text-xs ml-1">(Unavailable)</span>}
            </span>
            <span className="text-[12px] text-[#737373]">{item.category}</span>
          </div>

          {/* Prices */}
          <div className="flex flex-col items-end shrink-0">
            <span className="font-extrabold text-[15px] text-[#301010]">
              ৳{item.price}
            </span>
            {item.originalPrice > item.price && (
              <div className="flex items-center gap-1.5 mt-0.5">
                {item.discountType && item.discountValue && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    -{item.discountType === 'PERCENTAGE' ? `${item.discountValue}%` : `৳${item.discountValue}`}
                  </span>
                )}
                <span className="text-[11px] text-[#a3a3a3] line-through">
                  ৳{item.originalPrice}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setEditingItem(item)}
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
              onClick={() => handleDelete(item.id)}
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

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}
