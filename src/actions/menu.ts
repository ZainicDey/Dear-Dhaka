"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function getMenuItems() {
  return await prisma.menuItem.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function createMenuItem(formData: FormData) {
  const name = String(formData.get("name"));
  const originalPrice = Number(formData.get("originalPrice"));
  const discountType = formData.get("discountType") as string | null;
  const discountValueStr = formData.get("discountValue");
  const discountValue = discountValueStr ? Number(discountValueStr) : null;
  const description = String(formData.get("description"));
  const category = String(formData.get("category"));

  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const buffer = await imageFile.arrayBuffer();

    const { error } = await supabase.storage
      .from("menu-items")
      .upload(fileName, buffer, {
        contentType: imageFile.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error("Failed to upload image");
    }

    const { data } = supabase.storage.from("menu-items").getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  } else if (typeof formData.get("image") === "string") {
    imageUrl = formData.get("image") as string;
  }

  let price = originalPrice;
  if (discountType === "FLAT" && discountValue) {
    price = Math.max(0, originalPrice - discountValue);
  } else if (discountType === "PERCENTAGE" && discountValue) {
    price = Math.max(0, originalPrice - (originalPrice * discountValue) / 100);
  }

  await prisma.menuItem.create({
    data: {
      name,
      price,
      originalPrice,
      discountType,
      discountValue,
      description,
      category,
      image: imageUrl,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateMenuItem(id: string, formData: FormData) {
  const name = String(formData.get("name"));
  const originalPrice = Number(formData.get("originalPrice"));
  const discountType = formData.get("discountType") as string | null;
  const discountValueStr = formData.get("discountValue");
  const discountValue = discountValueStr ? Number(discountValueStr) : null;
  const description = String(formData.get("description"));
  const category = String(formData.get("category"));

  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const buffer = await imageFile.arrayBuffer();

    const { error } = await supabase.storage
      .from("menu-items")
      .upload(fileName, buffer, {
        contentType: imageFile.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error("Failed to upload image");
    }

    const { data } = supabase.storage.from("menu-items").getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  } else if (typeof formData.get("image") === "string") {
    imageUrl = formData.get("image") as string;
  }

  let price = originalPrice;
  if (discountType === "FLAT" && discountValue) {
    price = Math.max(0, originalPrice - discountValue);
  } else if (discountType === "PERCENTAGE" && discountValue) {
    price = Math.max(0, originalPrice - (originalPrice * discountValue) / 100);
  }

  await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      price,
      originalPrice,
      discountType,
      discountValue,
      description,
      category,
      ...(imageUrl && { image: imageUrl }),
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteMenuItem(id: string) {
  await prisma.menuItem.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}

export async function toggleMenuItemAvailability(id: string) {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) throw new Error("Item not found");

  await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
  });

  revalidatePath("/dashboard");
}
