import Image from "next/image";
import HeroBg from "@/assets/images/Hero.png";
import HeroOverlay from "@/assets/images/Hero-overlay.png";
import HeroLogo from "@/assets/images/Heromiddle.png";
import LocationIcon from "@/assets/images/Locaion.png";
import RefreshIcon from "@/assets/images/Refresh.png";
import SandtimerIcon from "@/assets/images/Sandtimer.png";
import ReviewIcon from "@/assets/images/Review.png";
import DeliveryIcon from "@/assets/images/Delivery.png";

// The scrollable background banner — scrolls away with the page
export function HeroBanner({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <section className="relative flex flex-col items-center z-20">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden">
        <Image
          src={HeroBg}
          alt="Dear Dhaka food spread"
          priority
          className="w-full max-h-[170px] object-cover"
        />

        {/* Image Overlay layer */}
        <Image
          src={HeroOverlay}
          alt="Overlay"
          fill
          className="opacity-90 z-[1] object-cover"
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-[2] flex justify-end items-start px-10 pt-6">
          {/* Location
          <div className="flex items-start gap-2">
            <Image
              src={LocationIcon}
              alt="Location"
              width={36}
              height={36}
              className="shrink-0 mt-0.5 drop-shadow"
            />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white leading-tight m-0 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                Road 07, Block B, Niketan
              </h2>
              <p className="text-sm text-white/90 mt-0.5 font-medium">
                Golam Zakaria
              </p>
              <p className="text-xs text-white/80 mt-px">01612-345678</p>
            </div>
          </div>
          */}

          {/* Refresh button */}
          <button
            onClick={() => {
              if (onRefresh) onRefresh();
            }}
            className="bg-transparent border-none cursor-pointer drop-shadow transition-transform duration-300 active:rotate-180 -mt-4"
            aria-label="Refresh"
          >
            <Image src={RefreshIcon} alt="Refresh" width={54} height={54} />
          </button>
        </div>
      </div>
    </section>
  );
}

// The logo bridge + restaurant info — goes into the sticky header
export function HeroInfo() {
  return (
    <div className="relative flex flex-col items-center bg-brand-white-dark">
      {/* Logo bridge — white curved arch overlapping the banner */}
      <div className="relative flex justify-center w-full -mt-16 z-10">
        <div
          className="rounded-4xl px-11 flex justify-center items-end"
          style={{
            border: "1px solid transparent",
            backgroundImage:
              "linear-gradient(#ffffff, #ffffff), linear-gradient(180deg, #fcb215, #fdfffc)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <Image
            src={HeroLogo}
            alt="Dear Dhaka logo"
            width={160}
            height={80}
            className="w-[140px] h-auto scale-115 origin-bottom -mb-6"
          />
        </div>
      </div>

      {/* Restaurant info */}
      <div className="text-center px-4 pb-4">
        <h1 className="text-2xl font-extrabold text-foreground mb-2.5 tracking-tight">
          Dear Dhaka
        </h1>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 text-[13px] text-neutral-800 bg-brand-cream px-3 py-1.5 rounded-full whitespace-nowrap">
            <Image src={SandtimerIcon} alt="Time" width={18} height={18} />
            25-35 mins
          </span>
          <span className="inline-flex items-center gap-2 text-[13px] bg-brand-cream px-3 py-1.5 rounded-full whitespace-nowrap">
            <Image src={ReviewIcon} alt="Rating" width={18} height={18} />
            4.9
          </span>
          <span className="inline-flex items-center gap-2 text-[13px] text-neutral-800 bg-brand-cream px-3 py-1.5 rounded-full whitespace-nowrap">
            <Image src={DeliveryIcon} alt="Delivery" width={18} height={18} />
            Free Delivery
          </span>
        </div>
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default function Hero() {
  return (
    <>
      <HeroBanner />
      <HeroInfo />
    </>
  );
}
