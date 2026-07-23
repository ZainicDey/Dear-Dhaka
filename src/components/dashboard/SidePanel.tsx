"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DashboardSection } from "@/app/dashboard/page";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: DashboardSection;
  onSectionSelect: (section: DashboardSection) => void;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  children?: { label: string; section: DashboardSection }[];
  section?: DashboardSection;
}

const navGroups: NavGroup[] = [
  {
    label: "Dashboard",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    section: "dashboard" as DashboardSection,
  },
  {
    label: "Menu Manager",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3h18v18H3z" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    children: [
      { label: "Add New Item", section: "add-item" },
      { label: "All Items", section: "all-items" },
      { label: "Categories", section: "categories" },
    ],
  },
  {
    label: "Order List",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    section: "orders" as DashboardSection,
  },
  {
    label: "Marketing",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    children: [
      { label: "AD Banners", section: "ad-banners" },
      { label: "Coupons", section: "coupons" },
    ],
  },
];

export default function SidePanel({
  isOpen,
  onClose,
  activeSection,
  onSectionSelect,
}: SidePanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Menu Manager", "Marketing"])
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#fefdfb] z-50 shadow-2xl flex flex-col"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 pt-8 pb-5 border-b border-[#e5e5e5]/50">
              <div>
                <h2 className="text-[18px] font-extrabold text-[#301010] leading-none">
                  Dear Dhaka
                </h2>
                <span className="text-[12px] text-[#737373] mt-1 block">
                  Admin Panel
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f4f3ed] cursor-pointer active:scale-95 transition-transform"
                aria-label="Close menu"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#301010"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              {navGroups.map((group) => (
                <div key={group.label} className="mb-1">
                  {/* Group header / direct link */}
                  <button
                    onClick={() => {
                      if (group.children) {
                        toggleGroup(group.label);
                      } else if (group.section) {
                        onSectionSelect(group.section);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                      group.section && activeSection === group.section
                        ? "bg-brand-yellow/20 text-[#301010]"
                        : "text-[#301010] hover:bg-[#f4f3ed]"
                    }`}
                  >
                    <span className="text-[#737373]">{group.icon}</span>
                    <span className="flex-1 text-left font-semibold text-[15px]">
                      {group.label}
                    </span>
                    {group.children && (
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a3a3a3"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{
                          rotate: expandedGroups.has(group.label) ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </motion.svg>
                    )}
                  </button>

                  {/* Children */}
                  {group.children && (
                    <AnimatePresence initial={false}>
                      {expandedGroups.has(group.label) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-8 mt-1 mb-2 border-l-2 border-[#e5e5e5] pl-3">
                            {group.children.map((child) => (
                              <button
                                key={child.section}
                                onClick={() => onSectionSelect(child.section)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-[14px] ${
                                  activeSection === child.section
                                    ? "bg-brand-yellow/20 font-bold text-[#301010]"
                                    : "text-[#555] hover:bg-[#f4f3ed] font-medium"
                                }`}
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Panel footer */}
            <div className="px-5 py-4 border-t border-[#e5e5e5]/50">
              <span className="text-[12px] text-[#a3a3a3]">
                Dear Dhaka Dashboard v1.0
              </span>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
