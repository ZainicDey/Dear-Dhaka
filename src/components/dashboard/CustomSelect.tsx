"use client";

import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export default function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
  required,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={ref} className="relative">
      {/* Hidden native input for form validation */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-white rounded-xl py-3 pl-4 pr-10 text-[14px] outline-none border transition-colors text-left cursor-pointer ${
          isOpen
            ? "border-brand-yellow"
            : "border-[#e5e5e5]"
        } ${value ? "text-[#301010]" : "text-[#a3a3a3]"}`}
      >
        {selectedLabel}
      </button>

      {/* Arrow icon */}
      <svg
        className={`absolute right-4 top-[14px] pointer-events-none transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#301010"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-[#e5e5e5] shadow-lg flex flex-col gap-0.5 p-1.5">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[13px] rounded-xl cursor-pointer transition-colors ${
                value === option.value
                  ? "bg-brand-yellow text-[#301010] font-semibold"
                  : "text-[#301010] hover:bg-brand-yellow"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
