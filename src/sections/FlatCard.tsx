"use client";

import Image from "next/image";
import FlatCardImage from "@/assets/images/FlatCard.png";
import FlatCardTopImage from "@/assets/images/FlatCardTop.png";
import { useRef } from "react";

interface FlatCardData {
  id: number;
  discount: number;
  couponCode: string;
}

const mockFlatCards: FlatCardData[] = [
  { id: 1, discount: 15, couponCode: "DEARDHAKA15" },
  { id: 2, discount: 20, couponCode: "YUMMY20" },
  { id: 3, discount: 10, couponCode: "TASTY10" },
  { id: 4, discount: 15, couponCode: "TASTY15" },
  { id: 5, discount: 25, couponCode: "TASTY25" },
];

function FlatCardItem({ discount, couponCode }: Omit<FlatCardData, "id">) {
  return (
    <div
      className="relative shrink-0 w-[130px] rounded-[28px] snap-start"
      style={{ userSelect: "none" }}
    >
      <Image
        src={FlatCardImage}
        alt={`Flat ${discount}% off`}
        className="w-full h-auto object-cover rounded-[28px]"
        draggable={false}
        sizes="160px"
        style={{ pointerEvents: "none" }}
      />

      <Image
        src={FlatCardTopImage}
        alt="Top Overlay"
        className="absolute bottom-0 left-0 w-[115%] h-auto max-w-none z-[1] rounded-bl-[28px]"
        draggable={false}
        style={{ pointerEvents: "none" }}
      />

      {/* Top overlay — discount text */}
      <div
        className="absolute top-0 left-0 right-0 z-[2] px-2.5 pt-3.5 pb-2.5 text-center"
        style={{ pointerEvents: "none" }}
      >
        <p className="text-[15px] font-extrabold text-white m-0 leading-tight [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
          FLAT {discount}% OFF!
        </p>
        <p className="text-[11px] font-medium text-white/90 mt-0.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
          On direct Orders
        </p>
      </div>

      {/* Coupon code inside the card at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pb-3 px-3 flex justify-center"
        style={{ pointerEvents: "none" }}
      >
        <p
          className="text-[11px] bg-black/40 font-bold m-0 tracking-widest px-1 py-1 rounded-md"
          style={{
            color: "#FFA726",
            border: "1.5px dashed #FFA726",
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          {couponCode}
        </p>
      </div>
    </div>
  );
}

export default function FlatCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only use JS dragging for mouse. Touch devices should use native scrolling.
    if (e.pointerType !== "mouse") return;

    const el = scrollRef.current;
    if (!el) return;

    isDown.current = true;
    startX.current = e.clientX;
    scrollLeft.current = el.scrollLeft;

    // Temporarily remove snapping so it doesn't fight the JS scroll
    el.classList.remove("snap-x", "snap-mandatory");

    // Capture pointer so mousemove keeps firing even if the mouse leaves the element
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !isDown.current || !scrollRef.current)
      return;

    const dx = e.clientX - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;

    const el = scrollRef.current;
    if (!el) return;

    isDown.current = false;

    // Restore snapping when drag is finished so it snaps to the nearest card
    el.classList.add("snap-x", "snap-mandatory");

    el.releasePointerCapture(e.pointerId);
    el.style.cursor = "grab";
  };

  return (
    <section className="pb-4">
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex ml-5 gap-7 overflow-x-auto px-4 snap-x snap-mandatory scrollbar-hide select-none cursor-grab"
      >
        {mockFlatCards.map((card) => (
          <FlatCardItem key={card.id} discount={card.discount} couponCode={card.couponCode} />
        ))}
      </div>
    </section>
  );
}
