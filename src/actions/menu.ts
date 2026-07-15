"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMenuItems() {
  return await prisma.menuItem.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createMenuItem(formData: FormData) {
  const name = String(formData.get("name"));
  const price = Number(formData.get("price"));
  const originalPrice = Number(formData.get("originalPrice"));
  const description = String(formData.get("description"));
  const category = String(formData.get("category"));
  const image = formData.get("image") as string | null;

  await prisma.menuItem.create({
    data: {
      name,
      price,
      originalPrice,
      description,
      category,
      image,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateMenuItem(id: string, formData: FormData) {
  const name = String(formData.get("name"));
  const price = Number(formData.get("price"));
  const originalPrice = Number(formData.get("originalPrice"));
  const description = String(formData.get("description"));
  const category = String(formData.get("category"));
  const image = formData.get("image") as string | null;

  await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      price,
      originalPrice,
      description,
      category,
      ...(image && { image }),
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
