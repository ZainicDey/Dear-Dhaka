import Hero from "@/sections/Hero";
import FlatCards from "@/sections/FlatCard";
import MenuSection from "@/sections/Items";

import CartStickyButton from "@/components/CartStickyButton";

export default function Home() {
  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-full max-w-[480px] relative overflow-x-hidden flex flex-col bg-brand-white-dark sm:shadow-[0_0_40px_rgba(0,0,0,0.08),0_0_80px_rgba(118,84,52,0.06)]">
        <Hero />
        <FlatCards />
        <MenuSection />
        <CartStickyButton />
      </div>
    </div>
  );
}
