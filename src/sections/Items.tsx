"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import SearchIcon from "@/assets/images/Search.png";
import AddItemIcon from "@/assets/images/Add-item.png";
import MockItemImage from "@/assets/images/Mock-item-image1.png";
import { useCart } from "@/context/CartContext";

// --- Types ---
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
}

// --- Mock Data ---
const categories = [
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

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chicken Shingara",
    price: 120,
    originalPrice: 140,
    description:
      "3 pcs - Chiken Keema filled inside a mashed potato ball of yumminess. The smell will take you to your pretiest memories!",
    category: "Breakfast Specials",
  },
  {
    id: 2,
    name: "Egg noodles",
    price: 140,
    originalPrice: 175,
    description:
      "Stir-fried egg noodles with fresh vegetables and a hint of soy. A new trip to school tiffin!",
    category: "Breakfast Specials",
  },
  {
    id: 3,
    name: "Paratha Platter",
    price: 99,
    originalPrice: 120,
    description:
      "2 pcs flaky layered paratha served with spicy egg curry. Comfort food at its finest!",
    category: "Lunch Menu",
  },
  {
    id: 4,
    name: "Chicken Roll",
    price: 80,
    originalPrice: 100,
    description:
      "Juicy spiced chicken wrapped in a soft paratha with tangy sauce and crunchy onions.",
    category: "Snacks Menu",
  },
  {
    id: 5,
    name: "Combo Meal",
    price: 250,
    originalPrice: 320,
    description:
      "Rice, chicken curry, dal, salad, and a drink. The ultimate value meal for hungry souls!",
    category: "Combo",
  },
];

// --- Sub-components ---

function SearchBar() {
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
          className="flex-1 bg-transparent outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

function CategoryTabs({
  selected,
  onSelect,
}: {
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
    <div className="relative px-3 pt-4 pb-0 ">
      {/* Tabs row */}
      <div 
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex gap-2 overflow-x-auto scrollbar-hide select-none cursor-grab snap-x snap-mandatory"
      >
        {categories.map((cat) => {
          const isActive = cat === selected;
          return (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              className="relative shrink-0 px-2 pb-2.5 text-[14px] font-bold cursor-pointer bg-transparent border-none outline-none snap-start"
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

function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();

  return (
    <div
      className="px-5 py-5"
      style={{ backgroundColor: "var(--color-brand-white-dark)" }}
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
            <span className="relative inline-flex items-center text-[#301010]">
              <span className="text-[12px] mr-[2px] relative top-[0px]">৳</span>
              <span className="text-[14px]">{item.originalPrice}</span>
              <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#301010] -translate-y-1/2"></span>
            </span>
          </div>

          {/* Description */}
          <p className="text-[14px] text-[#262114] mt-4 font-light">
            {item.description}
          </p>
        </div>

        {/* Right: food image with add button */}
        <div className="relative shrink-0 w-[130px] h-[130px]">
          <Image
            src={MockItemImage}
            alt={item.name}
            className="w-full h-full object-cover rounded-2xl"
            sizes="130px"
          />
          {/* Add button — bottom right of image */}
          <button
            className="absolute bottom-1 right-1 w-12 h-12 cursor-pointer "
            onClick={() => addToCart(item)}
            // style={{ backgroundColor: "var(--color-brand-cream)" }}
          >
            <Image
              src={AddItemIcon}
              alt="Add item"
              // className="w-16 h-16"
              // sizes="24px"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredItems = mockMenuItems.filter(
    (item) => item.category === selectedCategory,
  );

  return (
    <section className="border-[1.1px] mt-4 border-[#d9d9d9]/50 rounded-t-4xl overflow-hidden">
      {/* Search bar */}
      <SearchBar />

      {/* Category tabs — sticky so they stay visible while scrolling items */}
      <div className="sticky top-0 z-10 bg-brand-white-dark">
        <CategoryTabs
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-3 bg-brand-cream">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
      <div className="pb-14 bg-brand-white-dark"></div>
    </section>
  );
}
