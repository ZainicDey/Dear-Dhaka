"use client";

import { useState } from "react";

const mockCustomers = [
  {
    id: "1",
    name: "Rahim Uddin",
    phone: "01712345678",
    email: "rahim@mail.com",
    orderCount: 12,
  },
  {
    id: "2",
    name: "Fatima Akter",
    phone: "01898765432",
    email: "fatima@mail.com",
    orderCount: 8,
  },
  {
    id: "3",
    name: "Kamal Hossain",
    phone: "01611223344",
    email: null,
    orderCount: 3,
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    phone: "01555667788",
    email: "nusrat@mail.com",
    orderCount: 21,
  },
];

export default function CustomerList() {
  const [customers] = useState(mockCustomers);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full bg-white rounded-xl py-3 pl-10 pr-4 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
        />
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 flex items-center justify-between">
        <div>
          <span className="text-[24px] font-extrabold text-[#301010] leading-none">
            {customers.length}
          </span>
          <span className="text-[12px] text-[#737373] ml-2">
            Total Customers
          </span>
        </div>
        <div>
          <span className="text-[24px] font-extrabold text-brand-yellow leading-none">
            {customers.reduce((sum, c) => sum + c.orderCount, 0)}
          </span>
          <span className="text-[12px] text-[#737373] ml-2">Total Orders</span>
        </div>
      </div>

      {/* Customer cards */}
      {filtered.map((customer) => (
        <div
          key={customer.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center shrink-0">
                <span className="font-extrabold text-[16px] text-[#301010]">
                  {customer.name.charAt(0)}
                </span>
              </div>
              <div>
                <span className="font-bold text-[15px] text-[#301010] block leading-none">
                  {customer.name}
                </span>
                <span className="text-[12px] text-[#737373] mt-1 block">
                  {customer.phone}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-extrabold text-[16px] text-[#301010] leading-none">
                {customer.orderCount}
              </span>
              <span className="text-[11px] text-[#a3a3a3] mt-0.5">orders</span>
            </div>
          </div>
          {customer.email && (
            <div className="mt-2 pt-2 border-t border-[#f4f3ed]">
              <span className="text-[12px] text-[#737373]">
                {customer.email}
              </span>
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-8 text-[#a3a3a3] text-[14px]">
          No customers found
        </div>
      )}
    </div>
  );
}
