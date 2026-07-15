"use client";

interface DashboardHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export default function DashboardHeader({
  title,
  onMenuToggle,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur-md border-b border-[#e5e5e5]/50">
      <div className="flex items-center px-5 py-4">
        {/* Hamburger button */}
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm cursor-pointer active:scale-95 transition-transform"
          aria-label="Open menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#301010"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="16" y2="12" />
            <line x1="3" y1="18" x2="12" y2="18" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-[20px] font-extrabold ml-4 text-[#301010]">
          {title}
        </h1>
      </div>
    </header>
  );
}
