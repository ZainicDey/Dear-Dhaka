"use client";

import { useState, useRef, useEffect } from "react";
import { HeroBanner, HeroInfo } from "@/sections/Hero";
import FlatCards from "@/sections/FlatCard";
import MenuSection, {
  SearchBar,
  CategoryTabs,
} from "@/sections/Items";
import CartStickyButton from "@/components/CartStickyButton";
import { getCategories } from "@/actions/categories";

export default function Home() {
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const heroInfoRef = useRef<HTMLDivElement>(null);
  const [heroInfoHeight, setHeroInfoHeight] = useState<number | undefined>(
    undefined,
  );

  // Fetch dynamic categories from Prisma database
  useEffect(() => {
    getCategories()
      .then((dbCategories) => {
        if (dbCategories && dbCategories.length > 0) {
          const names = dbCategories.map((c: { name: string }) => c.name);
          setCategoriesList(names);
          setSelectedCategory(names[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories from database:", err);
      });
  }, []);

  // Use ResizeObserver to track HeroInfo height accurately
  useEffect(() => {
    const el = heroInfoRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setHeroInfoHeight(el.offsetHeight);
    });
    observer.observe(el);
    setHeroInfoHeight(el.offsetHeight);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-full max-w-[480px] relative overflow-x-clip flex flex-col bg-brand-white-dark sm:shadow-[0_0_40px_rgba(0,0,0,0.08),0_0_80px_rgba(118,84,52,0.06)]">
        {/* Sticky background to hide scrolling elements behind the transparent corners of the logo bridge */}
        <div className="sticky top-0 z-10 w-full h-0">
          <div className="absolute top-0 left-0 w-full h-16 bg-brand-white-dark" />
        </div>

        {/* Hero banner — scrolls away */}
        <HeroBanner onRefresh={() => setRefreshTrigger((prev) => prev + 1)} />

        {/* ── Sticky zone 1: Logo + Dear Dhaka + badges ────────── */}
        <div
          ref={heroInfoRef}
          className="sticky -top-12 z-30 bg-brand-white-dark"
        >
          <HeroInfo />
        </div>

        {/* FlatCards — scrolls between the two sticky zones */}
        <FlatCards />

        {/* ── Search bar, Category tabs, and Menu items ─────────── */}
        <section className="border-[1.1px] mt-3 border-[#d9d9d9]/50 rounded-t-4xl overflow-clip bg-brand-white-dark relative">
          {/* Sticky zone 2: Search bar + Category tabs */}
          {heroInfoHeight !== undefined && (
            <div
              className="sticky z-20 bg-brand-white-dark"
              style={{ top: heroInfoHeight - 60 }}
            >
              <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
              <CategoryTabs
                categories={categoriesList}
                selected={selectedCategory}
                onSelect={(cat) => {
                  setSelectedCategory(cat);
                  setSearchQuery(""); // Clear search when category changes
                }}
              />
            </div>
          )}

          {/* Menu items — scrolls under the sticky zone */}
          <MenuSection
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            refreshTrigger={refreshTrigger}
          />
        </section>

        <CartStickyButton />
      </div>
    </div>
  );
}
