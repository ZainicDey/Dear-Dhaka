"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrders } from "@/actions/order";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  couponDiscount?: number | null;
  total: number;
  address: string;
  deliveryInstructions: string | null;
  items: OrderItem[];
  createdAt: Date;
}

type SortOrder = "newest" | "oldest";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination & Aggregation state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const limit = 20;

  // Filter / sort state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dateFrom, dateTo, sortOrder]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders({
        search: debouncedSearch,
        dateFrom,
        dateTo,
        sortOrder,
        page,
        limit,
      });
      setOrders(
        data.orders.map((o) => ({
          ...o,
          items: o.items as unknown as OrderItem[],
          createdAt: new Date(o.createdAt),
        }))
      );
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
      setTotalRevenue(data.totalRevenue);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, dateFrom, dateTo, sortOrder, page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const truncateItems = (items: OrderItem[]) => {
    const names = items.map((i) => `${i.quantity}x ${i.name}`);
    const joined = names.join(", ");
    return joined.length > 40 ? joined.slice(0, 40) + "…" : joined;
  };

  const buildOrderMessage = (order: Order) => {
    const couponDisc = order.couponDiscount || 0;
    const directDiscount = Math.max(0, order.discount - couponDisc);
    const discountPercent =
      order.subtotal > 0
        ? Math.round((directDiscount / order.subtotal) * 100)
        : 0;

    const itemLines = order.items
      .map(
        (item) =>
          `${item.name} x${item.quantity} = ৳${item.price * item.quantity}`
      )
      .join("\n");

    const lines = [
      `order_id: #${order.orderNumber}`,
      "Hi Dear Dhaka!",
      "I'd like to order:",
      "",
      itemLines,
      "",
      `Sub-total = ৳${order.subtotal}`,
    ];

    if (directDiscount > 0) {
      lines.push(`Direct Order Discount (${discountPercent}%) = ৳${directDiscount}`);
    }

    if (order.couponCode && couponDisc > 0) {
      lines.push(`Coupon (${order.couponCode}) = -৳${couponDisc}`);
    }

    lines.push(
      `Delivery = Free (${order.address})`,
      "",
      `Total = ৳${order.total}`,
      "",
      `Address: ${order.address}${order.deliveryInstructions ? `, ${order.deliveryInstructions}` : ""}`
    );

    return lines.join("\n");
  };

  const hasActiveFilters = search || dateFrom || dateTo || sortOrder !== "newest";

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setSortOrder("newest");
    setPage(1);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 animate-pulse"
          >
            <div className="h-4 bg-[#f4f3ed] rounded w-1/3 mb-3" />
            <div className="h-3 bg-[#f4f3ed] rounded w-2/3 mb-2" />
            <div className="h-3 bg-[#f4f3ed] rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 flex items-center justify-between">
          <div>
            <span className="text-[24px] font-extrabold text-[#301010] leading-none">
              {totalOrders}
            </span>
            <span className="text-[12px] text-[#737373] ml-2">
              {hasActiveFilters ? "Matching" : "Total"} Orders
            </span>
          </div>
          <div>
            <span className="text-[24px] font-extrabold text-brand-yellow leading-none">
              ৳{totalRevenue.toLocaleString()}
            </span>
            <span className="text-[12px] text-[#737373] ml-2">Revenue</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
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
            placeholder="Search by order ID (e.g. DD-123456)…"
            className="w-full bg-white rounded-xl py-3 pl-10 pr-12 text-[14px] outline-none border border-[#e5e5e5] focus:border-brand-yellow transition-colors text-[#301010] placeholder:text-[#a3a3a3]"
          />
          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              showFilters || hasActiveFilters
                ? "bg-brand-yellow/30 text-[#301010]"
                : "text-[#a3a3a3] hover:text-[#301010]"
            }`}
            aria-label="Toggle filters"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-[#e5e5e5]/50 shadow-sm p-4 flex flex-col gap-4">

                {/* Date range */}
                <div>
                  <span className="text-[12px] font-semibold text-[#737373] uppercase tracking-wide mb-2 block">
                    Date Range
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#a3a3a3] mb-1 block">From</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full bg-[#f4f3ed] rounded-xl px-3 py-2.5 text-[13px] outline-none border border-transparent focus:border-brand-yellow transition-colors text-[#301010]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#a3a3a3] mb-1 block">To</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full bg-[#f4f3ed] rounded-xl px-3 py-2.5 text-[13px] outline-none border border-transparent focus:border-brand-yellow transition-colors text-[#301010]"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <span className="text-[12px] font-semibold text-[#737373] uppercase tracking-wide mb-2 block">
                    Sort
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSortOrder("newest")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                        sortOrder === "newest"
                          ? "bg-brand-yellow/20 text-[#301010]"
                          : "bg-[#f4f3ed] text-[#737373]"
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                      Newest
                    </button>
                    <button
                      onClick={() => setSortOrder("oldest")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                        sortOrder === "oldest"
                          ? "bg-brand-yellow/20 text-[#301010]"
                          : "bg-[#f4f3ed] text-[#737373]"
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                      Oldest
                    </button>
                  </div>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[13px] text-[#a3a3a3] hover:text-[#301010] transition-colors text-center py-1 cursor-pointer"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order cards */}
        <div className={`transition-opacity duration-200 ${loading ? "opacity-50" : "opacity-100"}`}>
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 text-left w-full cursor-pointer active:scale-[0.98] transition-transform mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-[15px] text-[#301010]">
                  #{order.orderNumber}
                </span>
                <span className="font-extrabold text-[16px] text-[#301010]">
                  ৳{order.total}
                </span>
              </div>
              <p className="text-[13px] text-[#737373] leading-snug mb-2">
                {truncateItems(order.items)}
              </p>
              <span className="text-[11px] text-[#a3a3a3]">
                {formatDate(order.createdAt)}
              </span>
            </button>
          ))}
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#f4f3ed] flex items-center justify-center mx-auto mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a3a3a3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <p className="text-[14px] text-[#a3a3a3]">
              {totalOrders === 0 && !hasActiveFilters ? "No orders yet" : "No orders match your filters"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-[13px] text-brand-yellow font-semibold cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-sm border border-[#e5e5e5]/50 mt-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-[13px] font-bold text-[#301010] bg-[#f4f3ed] rounded-xl disabled:opacity-50 transition-colors hover:bg-[#e5e5e5] cursor-pointer"
            >
              Previous
            </button>
            <span className="text-[13px] font-bold text-[#737373]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-[13px] font-bold text-[#301010] bg-[#f4f3ed] rounded-xl disabled:opacity-50 transition-colors hover:bg-[#e5e5e5] cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setSelectedOrder(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="bg-[#fefdfb] rounded-t-3xl shadow-2xl">
                {/* Modal handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-[#d4d4d4] rounded-full" />
                </div>

                {/* Modal header */}
                <div className="flex items-center justify-between px-5 pb-4 border-b border-[#e5e5e5]/50">
                  <div>
                    <h3 className="font-extrabold text-[18px] text-[#301010]">
                      #{selectedOrder.orderNumber}
                    </h3>
                    <span className="text-[12px] text-[#737373]">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f4f3ed] cursor-pointer active:scale-95 transition-transform"
                    aria-label="Close order details"
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

                {/* Order message */}
                <div className="px-5 py-5">
                  <pre className="text-[13px] text-[#301010] leading-relaxed whitespace-pre-wrap font-[inherit] bg-[#f4f3ed] rounded-2xl p-4">
                    {buildOrderMessage(selectedOrder)}
                  </pre>
                </div>

                {/* Bottom safe area spacer */}
                <div className="h-6" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
