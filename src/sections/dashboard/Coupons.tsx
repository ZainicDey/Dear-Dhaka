"use client";

import { useState, useEffect } from "react";
import { getCoupons, createCoupon, toggleCoupon, deleteCoupon } from "@/actions/marketing";

export default function Coupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = async (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    );
    try {
      await toggleCoupon(id);
      fetchCoupons();
    } catch (error) {
      console.error("Error toggling coupon:", error);
      fetchCoupons();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createCoupon(formData);
      if (result && !result.success) {
        console.error(result.error);
        return;
      }
      setShowForm(false);
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading coupons...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add coupon button / form toggle */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-brand-yellow rounded-xl py-3.5 font-bold text-[#301010] text-[14px] cursor-pointer active:scale-[0.98] transition-transform"
      >
        {showForm ? "Cancel" : "+ Create New Coupon"}
      </button>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e5e5]/50 flex flex-col gap-3">
          <input
            type="text"
            name="code"
            required
            placeholder="Coupon code (e.g. SAVE20)"
            className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010] placeholder:text-[#a3a3a3] uppercase tracking-wider"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as "percent" | "amount")
              }
              className="flex-1 bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010]"
            >
              <option value="percent">Percentage (%)</option>
              <option value="amount">Fixed Amount (৳)</option>
            </select>

            <input
              type="number"
              name={discountType === "percent" ? "discountPercent" : "discountAmount"}
              required
              placeholder={
                discountType === "percent" ? "Discount %" : "Discount Amount"
              }
              className="flex-1 bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010] placeholder:text-[#a3a3a3]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              name="minOrderAmount"
              placeholder="Min Order (Optional)"
              className="flex-1 bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010] placeholder:text-[#a3a3a3]"
            />
            <input
              type="number"
              name="maxDiscountCap"
              placeholder="Max Cap (Optional)"
              className="flex-1 bg-[#f4f3ed] rounded-xl py-3 px-4 text-[14px] outline-none text-[#301010] placeholder:text-[#a3a3a3]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-[12px] text-[#737373] ml-2 block mb-1">
                Start Date (Optional)
              </label>
              <input
                type="datetime-local"
                name="startDate"
                className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[13px] outline-none text-[#301010]"
              />
            </div>
            <div className="flex-1">
              <label className="text-[12px] text-[#737373] ml-2 block mb-1">
                Expiry Date (Optional)
              </label>
              <input
                type="datetime-local"
                name="expiryDate"
                className="w-full bg-[#f4f3ed] rounded-xl py-3 px-4 text-[13px] outline-none text-[#301010]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-brand-yellow rounded-xl py-3 font-bold text-[14px] text-[#301010] cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      )}

      {/* Coupons list */}
      {coupons.map((coupon) => {
        const isExpired = coupon.expiryDate
          ? new Date(coupon.expiryDate) < new Date()
          : false;

        return (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
              coupon.isActive && !isExpired
                ? "border-[#e5e5e5]/50"
                : "border-red-200 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="bg-[#f4f3ed] rounded-lg px-3 py-1.5 w-fit mb-2">
                  <span className="text-[14px] font-extrabold text-[#301010] tracking-wider">
                    {coupon.code}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-[#301010]">
                  {coupon.discountPercent
                    ? `${coupon.discountPercent}% OFF`
                    : `৳${coupon.discountAmount} OFF`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer active:scale-95 transition-all text-red-500"
                  aria-label="Delete coupon"
                  title="Delete coupon"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button
                  onClick={() => handleToggle(coupon.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                    coupon.isActive ? "bg-green-500" : "bg-[#d9d9d9]"
                  }`}
                  title={coupon.isActive ? "Disable Coupon" : "Enable Coupon"}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      coupon.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Constraints */}
            <div className="mt-3">
              {(coupon.minOrderAmount || coupon.maxDiscountCap) && (
                <div className="flex flex-wrap gap-2 text-[12px] mb-2">
                  {coupon.minOrderAmount && (
                    <span className="bg-[#f4f3ed] text-[#737373] px-2 py-0.5 rounded-md">
                      Min Order: ৳{coupon.minOrderAmount}
                    </span>
                  )}
                  {coupon.maxDiscountCap && (
                    <span className="bg-[#f4f3ed] text-[#737373] px-2 py-0.5 rounded-md">
                      Max Cap: ৳{coupon.maxDiscountCap}
                    </span>
                  )}
                </div>
              )}

              <div className="flex justify-between text-[12px]">
                <span className="text-[#737373]">
                  {coupon.startDate 
                    ? `Active from: ${new Date(coupon.startDate).toLocaleDateString()}` 
                    : "Active now"}
                </span>
                <span className="text-[#737373]">
                  {coupon.expiryDate
                    ? `Expires: ${new Date(coupon.expiryDate).toLocaleDateString()}`
                    : "No Expiry"}
                </span>
              </div>
            </div>

            {isExpired && (
              <div className="mt-2 text-[12px] font-semibold text-red-500">
                ⚠ Expired
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
