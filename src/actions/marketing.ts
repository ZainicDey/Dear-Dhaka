"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Banners ---

export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createBanner(formData: FormData) {
  const title = String(formData.get("title"));
  const subtitle = formData.get("subtitle") as string | null;
  const couponCode = formData.get("couponCode") as string | null;
  const imageUrl = formData.get("imageUrl") as string | null;

  const maxOrder = await prisma.banner.aggregate({
    _max: { order: true },
  });

  await prisma.banner.create({
    data: {
      title,
      subtitle,
      couponCode,
      imageUrl,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/dashboard");
}

export async function toggleBanner(id: string) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new Error("Banner not found");

  await prisma.banner.update({
    where: { id },
    data: { isActive: !banner.isActive },
  });

  revalidatePath("/dashboard");
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}

// --- Coupons ---

export async function getCoupons() {
  return await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createCoupon(formData: FormData) {
  const code = String(formData.get("code")).toUpperCase();
  const discountPercent = formData.get("discountPercent")
    ? Number(formData.get("discountPercent"))
    : null;
  const discountAmount = formData.get("discountAmount")
    ? Number(formData.get("discountAmount"))
    : null;
  const maxUses = Number(formData.get("maxUses")) || 0;
  const expiryDate = formData.get("expiryDate")
    ? new Date(String(formData.get("expiryDate")))
    : null;

  await prisma.coupon.create({
    data: {
      code,
      discountPercent,
      discountAmount,
      maxUses,
      expiryDate,
    },
  });

  revalidatePath("/dashboard");
}

export async function toggleCoupon(id: string) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new Error("Coupon not found");

  await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });

  revalidatePath("/dashboard");
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}
