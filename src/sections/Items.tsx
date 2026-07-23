"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@/assets/images/Search.png";
import AddItemIcon from "@/assets/images/Add-item.png";
import TrashIcon from "@/assets/images/Remove-trash.png";
import PlusBlackIcon from "@/assets/images/Plus-black.svg";
import MockItemImage from "@/assets/images/Mock-item-image1.png";
import { useCart } from "@/context/CartContext";

import { getMenuItems } from "@/actions/menu";

// --- Types ---
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountType?: string;
  discountValue?: number;
  description: string;
  category: string;
  image?: string | null;
  isAvailable?: boolean;
}

// --- Mock Data ---
export const categories = [
  "Breakfast Specials",
  "Lunch Menu",
  "Snacks Menu",
  "Combo",
  "Desi-Chinese Feasts",
  "Biryani Platters",
  "Khidmeer",
  "Street Style BBQ",
  "Beverages",
  "Add-ons",
];

// --- Sub-components ---

export function SearchBar({
  query = "",
  onQueryChange,
}: {
  query?: string;
  onQueryChange?: (val: string) => void;
}) {
  return (
    <div
      className="px-5 pt-5 pb-3"
      style={{ backgroundColor: "var(--color-brand-white-dark)" }}
    >
      <div className="flex items-center gap-3 bg-brand-cream rounded-full px-4 py-3 shadow-sm">
        <Image
          src={SearchIcon}
          alt="Search"
          className="w-6 h-6 opacity-60"
          sizes="24px"
        />
        <input
          type="text"
          placeholder="Search Menu..."
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

export function CategoryTabs({
  categories: categoriesList = categories,
  selected,
  onSelect,
}: {
  categories?: string[];
  selected: string;
  onSelect: (cat: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.clientX;
    scrollLeft.current = el.scrollLeft;
    el.classList.remove("snap-x", "snap-mandatory");
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !isDown.current || !scrollRef.current)
      return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) {
      if (!isDragging.current) {
        isDragging.current = true;
        scrollRef.current.setPointerCapture(e.pointerId);
      }
    }
    scrollRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = false;
    el.classList.add("snap-x", "snap-mandatory");
    if (isDragging.current) {
      el.releasePointerCapture(e.pointerId);
    }
    el.style.cursor = "grab";
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleSelect = (cat: string) => {
    if (isDragging.current) return;
    onSelect(cat);
  };

  return (
    <div className="relative px-3 pt-2">
      {/* Tabs row */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex gap-2 overflow-x-auto scrollbar-hide select-none cursor-grab snap-x snap-mandatory"
      >
        {categoriesList.map((cat) => {
          const isActive = cat === selected;
          return (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              className="relative shrink-0 px-2 pb-1 text-[14px] font-bold cursor-pointer bg-transparent border-none outline-none snap-start"
              style={{
                color: isActive ? "#301010" : "#737373",
              }}
            >
              {cat}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "3.5px",
                    backgroundColor: "#737373",
                    zIndex: 2,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Full-width gray baseline */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1.5px", backgroundColor: "#737373" }}
      />
    </div>
  );
}

function MenuItemCard({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i.id === item.id);

  return (
    <div
      className="px-5 py-5 cursor-pointer"
      style={{ backgroundColor: "var(--color-brand-white-dark)" }}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Left: text content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[22px] font-extrabold m-0 leading-tight"
            style={{ color: "#301010" }}
          >
            {item.name}
          </h3>

          {/* Price row */}
          <div className="flex items-center gap-2">
            <span
              className="text-[17px] text-[#301010] font-bold px-2.5 py-0.5 rounded-md"
              style={{ backgroundColor: "var(--color-brand-yellow)" }}
            >
              ৳{item.price}
            </span>
            {item.originalPrice > item.price && (
              <span className="relative inline-flex items-center text-[#301010]">
                <span className="text-[12px] mr-[2px] relative top-[0px]">
                  ৳
                </span>
                <span className="text-[14px]">{item.originalPrice}</span>
                <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#301010] -translate-y-1/2"></span>
              </span>
            )}
            {item.discountType && item.discountValue && (
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                -
                {item.discountType === "PERCENTAGE"
                  ? `${item.discountValue}%`
                  : `৳${item.discountValue}`}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[13.5px] text-[#262114] mt-4 font-light leading-tight tracking-tight">
            {item.description}
          </p>
        </div>

        {/* Right: food image with add button */}
        <div className="relative shrink-0 w-[130px] h-[130px]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover rounded-2xl ${item.isAvailable === false ? "grayscale opacity-70" : ""}`}
            />
          ) : (
            <Image
              src={MockItemImage}
              alt={item.name}
              className={`w-full h-full object-cover rounded-2xl ${item.isAvailable === false ? "grayscale opacity-70" : ""}`}
              sizes="130px"
            />
          )}
          {item.isAvailable === false && (
            <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xs uppercase bg-black/60 px-2 py-1 rounded">
                Sold Out
              </span>
            </div>
          )}
          {/* Add button / Quantity Controls */}
          {item.isAvailable !== false && (
            <div className={`absolute bottom-1 ${cartItem ? "right-4" : "right-3"}`} onClick={(e) => e.stopPropagation()}>
              {!cartItem ? (
                <button
                  className="w-9 h-9 cursor-pointer transition-transform active:scale-95 block"
                  onClick={() => addToCart(item)}
                >
                  <Image src={AddItemIcon} alt="Add item" />
                </button>
              ) : (
                <div className="flex items-center gap-3 border border-gray-200 rounded-full w-fit px-2 py-0.5 bg-white shadow-md">
                  <button
                    onClick={() =>
                      cartItem.quantity === 1
                        ? removeFromCart(cartItem.id)
                        : updateQuantity(cartItem.id, -1)
                    }
                    className="flex items-center justify-center cursor-pointer min-w-[20px]"
                  >
                    {cartItem.quantity === 1 ? (
                      <Image
                        src={TrashIcon}
                        alt="Remove"
                        width={18}
                        height={18}
                      />
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#301010"
                        strokeWidth="4.5"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    )}
                  </button>
                  <span className="font-bold text-[16px] w-4 text-center text-[#301010]">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(cartItem.id, 1)}
                    className="items-center ml-1 justify-center cursor-pointer"
                  >
                    <Image src={PlusBlackIcon} alt="Add" width={13} height={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function MenuSection({
  selectedCategory,
  searchQuery,
  refreshTrigger = 0,
}: {
  selectedCategory: string;
  searchQuery?: string;
  refreshTrigger?: number;
}) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  useEffect(() => {
    setLoading(true);
    getMenuItems()
      .then((data) => {
        setItems(data as any[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const filteredItems = items.filter((item) => {
    if (searchQuery && searchQuery.trim() !== "") {
      // Search by name
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    // Otherwise filter by category
    return (
      item.category?.trim().toLowerCase() ===
      selectedCategory?.trim().toLowerCase()
    );
  });

  return (
    <>
      {/* Menu items */}
      <div className="flex flex-col gap-3 bg-brand-cream min-h-[200px]">
        {loading ? (
          <div className="w-full py-12 flex justify-center items-center">
            <div className="w-48 h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-brand-yellow rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "linear",
                }}
                style={{ width: "50%" }}
              />
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex justify-center items-center py-10 px-5 text-center">
            <span className="text-[#301010] font-medium text-sm">
              No items available in this category.
            </span>
          </div>
        ) : (
          filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onClick={() => setSelectedItemForModal(item)} />
          ))
        )}
      </div>
      <div className="pb-14 bg-brand-white-dark"></div>

      <AnimatePresence>
        {selectedItemForModal && (
          <ItemModal 
            item={selectedItemForModal} 
            onClose={() => setSelectedItemForModal(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ItemModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i.id === item.id);
  
  const [localQuantity, setLocalQuantity] = useState(1);

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (cartItem) return;
    for (let i = 0; i < localQuantity; i++) {
      addToCart(item);
    }
    onClose();
  };

  const quantity = cartItem ? cartItem.quantity : localQuantity;

  const increase = () => {
    if (cartItem) {
      updateQuantity(item.id, 1);
    } else {
      setLocalQuantity(q => q + 1);
    }
  };

  const decrease = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeFromCart(item.id);
      } else {
        updateQuantity(item.id, -1);
      }
    } else {
      setLocalQuantity(q => (q > 1 ? q - 1 : 1));
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 1 }}
        onDragEnd={handleDragEnd}
        className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] z-[100] bg-white rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="w-full flex justify-center pt-3 pb-2 absolute top-0 z-10">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        
        <div className="overflow-y-auto w-full pb-24">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-64 object-cover select-none" draggable={false} />
          ) : (
            <Image src={MockItemImage} alt={item.name} className="w-full h-64 object-cover select-none" draggable={false} />
          )}

          <div className="p-5">
            <h2 className="text-2xl font-extrabold text-[#301010] mb-2">{item.name}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[17px] text-brand-yellow font-bold">
                ৳{item.price}
              </span>
              {item.originalPrice > item.price && (
                <span className="text-[14px] text-gray-500 line-through">
                  ৳{item.originalPrice}
                </span>
              )}
              {item.discountType && item.discountValue && (
                <span className="bg-red-100 text-[#e72765] text-[13px] font-bold px-1.5 py-0.5 rounded-sm ml-1">
                  -
                  {item.discountType === "PERCENTAGE"
                    ? `${item.discountValue}%`
                    : `৳${item.discountValue}`}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-[13.5px] leading-relaxed mb-6 font-light">
              {item.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={decrease}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#301010] active:bg-gray-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <span className="text-lg font-bold w-4 text-center text-[#301010]">{quantity}</span>
            <button 
              onClick={increase}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#301010] active:bg-gray-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!!cartItem}
            className={`flex-1 py-3.5 rounded-xl font-bold text-white text-[15px] ${cartItem ? 'bg-gray-400' : 'bg-brand-yellow active:scale-[0.98] transition-transform'}`}
          >
            {cartItem ? 'Added to cart' : 'Add to cart'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
