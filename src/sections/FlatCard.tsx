"use client";

import { useRef, useEffect, useState } from "react";
import { getBanners } from "@/actions/marketing";

function fallbackCopyText(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

function FlatCardItem({ banner }: { banner: any }) {
  const [copied, setCopied] = useState(false);
  if (!banner.imageUrl) return null;

  const handleClick = async () => {
    if (!banner.couponCode) return;

    let success = false;
    try {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(banner.couponCode);
        success = true;
      }
    } catch {
      // clipboard API failed, fall through to fallback
    }

    if (!success) {
      success = fallbackCopyText(banner.couponCode);
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="relative shrink-0 w-[130px] rounded-[28px] snap-start overflow-hidden shadow-sm cursor-pointer"
      style={{ userSelect: "none" }}
      onClick={handleClick}
    >
      <img
        src={banner.imageUrl}
        alt={banner.couponCode || "Promo Banner"}
        className="w-full h-auto object-cover rounded-[28px]"
        draggable={false}
        style={{ pointerEvents: "none" }}
      />

      {/* Copied toast – slides up from bottom */}
      {copied && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[10] flex items-center justify-center rounded-b-[28px] bg-black/70 py-[6px]"
          style={{
            animation: "flatcard-slide-up 0.25s ease-out",
          }}
        >
          <p className="text-white text-[14px] font-bold tracking-wide">
            Copied!
          </p>
        </div>
      )}
      <style jsx>{`
        @keyframes flatcard-slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function FlatCards() {
  const [banners, setBanners] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const wasDragged = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        const b = await getBanners();
        setBanners(b.filter((banner: any) => banner.isActive));
      } catch (err) {
        console.error("Error loading banners:", err);
      }
    }
    load();
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = true;
    wasDragged.current = false;
    startX.current = e.clientX;
    scrollLeft.current = el.scrollLeft;
    el.classList.remove("snap-x", "snap-mandatory");
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !isDown.current || !scrollRef.current)
      return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) wasDragged.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = false;
    el.classList.add("snap-x", "snap-mandatory");
    el.style.cursor = "grab";
  };

  // Block child clicks if the user was dragging, not tapping
  const onClickCapture = (e: React.MouseEvent) => {
    if (wasDragged.current) {
      e.stopPropagation();
      wasDragged.current = false;
    }
  };

  if (banners.length === 0) return null;

  return (
    <section>
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        className="flex gap-5 overflow-x-auto px-5 scroll-px-5 py-2 snap-x snap-mandatory scrollbar-hide select-none cursor-grab"
      >
        {banners.map((banner) => (
          <FlatCardItem key={banner.id} banner={banner} />
        ))}
      </div>
    </section>
  );
}
