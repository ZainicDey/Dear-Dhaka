"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SidePanel from "@/components/dashboard/SidePanel";
import { checkAdminSession } from "@/actions/auth";

// Section imports
import AddItem from "@/sections/dashboard/AddItem";
import AllItems from "@/sections/dashboard/AllItems";
import Categories from "@/sections/dashboard/Categories";
// import CustomerList from "@/sections/dashboard/CustomerList";
import OrderList from "@/sections/dashboard/OrderList";
import AdBanners from "@/sections/dashboard/AdBanners";
import Coupons from "@/sections/dashboard/Coupons";
import Login from "@/sections/dashboard/Login";

export type DashboardSection =
  | "add-item"
  | "all-items"
  | "categories"
  | "orders"
  | "ad-banners"
  | "coupons";

const sectionTitles: Record<DashboardSection, string> = {
  "add-item": "Add New Item",
  "all-items": "All Items",
  categories: "Categories",
  orders: "Order List",
  "ad-banners": "AD Banners",
  coupons: "Coupons",
};

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("all-items");

  useEffect(() => {
    checkAdminSession().then((isLoggedIn) => {
      setIsAuthenticated(isLoggedIn);
      setIsCheckingAuth(false);
    });
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

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
      case "orders":
        return <OrderList />;
      case "ad-banners":
        return <AdBanners />;
      case "coupons":
        return <Coupons />;
      default:
        return <AllItems />;
    }
  };

  // Don't flash anything while checking session
  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

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
