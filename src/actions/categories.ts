"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name"));

  // Get the current max order
  const maxOrder = await prisma.category.aggregate({
    _max: { order: true },
  });

  await prisma.category.create({
    data: {
      name,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}

export async function updateCategoryOrder(
  updates: { id: string; order: number }[]
) {
  await prisma.$transaction(
    updates.map((u) =>
      prisma.category.update({
        where: { id: u.id },
        data: { order: u.order },
      })
    )
  );

  revalidatePath("/dashboard");
}
