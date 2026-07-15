import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Dear Dhaka",
  description: "Admin dashboard for Dear Dhaka",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f0efe9]">
      <div className="w-full max-w-[480px] min-h-screen relative overflow-x-hidden bg-brand-cream">
        {children}
      </div>
    </div>
  );
}
