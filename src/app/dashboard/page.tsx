"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SidePanel from "@/components/dashboard/SidePanel";

// Section imports
import AddItem from "@/sections/dashboard/AddItem";
import AllItems from "@/sections/dashboard/AllItems";
import Categories from "@/sections/dashboard/Categories";
import CustomerList from "@/sections/dashboard/CustomerList";
import AdBanners from "@/sections/dashboard/AdBanners";
import Coupons from "@/sections/dashboard/Coupons";

export type DashboardSection =
  | "add-item"
  | "all-items"
  | "categories"
  | "customers"
  | "ad-banners"
  | "coupons";

const sectionTitles: Record<DashboardSection, string> = {
  "add-item": "Add New Item",
  "all-items": "All Items",
  categories: "Categories",
  customers: "Customer List",
  "ad-banners": "AD Banners",
  coupons: "Coupons",
};

export default function DashboardPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("all-items");

  const handleSectionSelect = (section: DashboardSection) => {
    setActiveSection(section);
    setIsPanelOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "add-item":
        return <AddItem />;
      case "all-items":
        return <AllItems />;
      case "categories":
        return <Categories />;
      case "customers":
        return <CustomerList />;
      case "ad-banners":
        return <AdBanners />;
      case "coupons":
        return <Coupons />;
      default:
        return <AllItems />;
    }
  };

  return (
    <>
      <DashboardHeader
        title={sectionTitles[activeSection]}
        onMenuToggle={() => setIsPanelOpen(true)}
      />

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
      />

      {/* Main content area */}
      <main className="px-4 pt-4 pb-8">{renderSection()}</main>
    </>
  );
}
