import CartSection from "@/sections/Cart/index";

export default function CartPage() {
  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen relative overflow-x-hidden sm:shadow-[0_0_40px_rgba(0,0,0,0.08),0_0_80px_rgba(118,84,52,0.06)] bg-[#F4F3ED]">
        <CartSection />
      </div>
    </div>
  );
}
