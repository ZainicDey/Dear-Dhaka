"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

// --- Banners ---

export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createBanner(formData: FormData) {
  const couponCode = formData.get("couponCode") as string | null;
  const imageFile = formData.get("image") as File | null;
  let imageUrl = formData.get("imageUrl") as string | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const buffer = await imageFile.arrayBuffer();
    
    const { error } = await supabase.storage
      .from("banners")
      .upload(fileName, buffer, {
        contentType: imageFile.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error("Failed to upload image");
    }

    const { data } = supabase.storage
      .from("banners")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const maxOrder = await prisma.banner.aggregate({
    _max: { order: true },
  });

  await prisma.banner.create({
    data: {
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

export async function reorderBanners(orderedIds: string[]) {
  // We can update the order of banners in a transaction
  const updates = orderedIds.map((id, index) =>
    prisma.banner.update({
      where: { id },
      data: { order: index },
    })
  );
  await prisma.$transaction(updates);
  revalidatePath("/dashboard");
}

// --- Coupons ---

export async function getCoupons() {
  return await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createCoupon(formData: FormData) {
  try {
    const code = String(formData.get("code")).toUpperCase();
    const discountPercent = formData.get("discountPercent")
      ? Number(formData.get("discountPercent"))
      : null;
    const discountAmount = formData.get("discountAmount")
      ? Number(formData.get("discountAmount"))
      : null;
    const minOrderAmount = formData.get("minOrderAmount")
      ? Number(formData.get("minOrderAmount"))
      : null;
    const maxDiscountCap = formData.get("maxDiscountCap")
      ? Number(formData.get("maxDiscountCap"))
      : null;
    
    const startDateStr = formData.get("startDate");
    const startDate = startDateStr ? new Date(String(startDateStr)) : undefined;
    
    const expiryDateStr = formData.get("expiryDate");
    const expiryDate = expiryDateStr ? new Date(String(expiryDateStr)) : null;

    await prisma.coupon.create({
      data: {
        code,
        discountPercent,
        discountAmount,
        minOrderAmount,
        maxDiscountCap,
        startDate,
        expiryDate,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Create coupon error:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "A coupon with this code already exists." };
    }
    return { success: false, error: error.message || "Failed to create coupon." };
  }
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

// --- Validate Coupon (for cart) ---

export async function validateCoupon(code: string, cartSubtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { valid: false, error: "Coupon not found" };
  }

  if (!coupon.isActive) {
    return { valid: false, error: "Coupon is not active" };
  }

  const now = new Date();

  // Check start date
  if (coupon.startDate && now < new Date(coupon.startDate)) {
    return { valid: false, error: "Coupon is not yet active" };
  }

  // Check expiry date
  if (coupon.expiryDate && now > new Date(coupon.expiryDate)) {
    return { valid: false, error: "Coupon has expired" };
  }

  // Check minimum order amount
  if (coupon.minOrderAmount && cartSubtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order of ৳${coupon.minOrderAmount} required`,
    };
  }

  // Calculate discount
  let discountAmount = 0;

  if (coupon.discountPercent) {
    discountAmount = Math.round(
      (cartSubtotal * coupon.discountPercent) / 100
    );
  } else if (coupon.discountAmount) {
    discountAmount = coupon.discountAmount;
  }

  // Apply max discount cap (null = unlimited)
  if (coupon.maxDiscountCap && discountAmount > coupon.maxDiscountCap) {
    discountAmount = coupon.maxDiscountCap;
  }

  // Can't discount more than the subtotal
  discountAmount = Math.min(discountAmount, cartSubtotal);

  return {
    valid: true,
    code: coupon.code,
    discountAmount: Math.round(discountAmount),
    label: coupon.discountPercent
      ? `${coupon.discountPercent}% OFF`
      : `৳${coupon.discountAmount} OFF`,
  };
}
