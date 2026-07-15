"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
  return await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createCustomer(formData: FormData) {
  const name = String(formData.get("name"));
  const phone = formData.get("phone") as string | null;
  const email = formData.get("email") as string | null;
  const address = formData.get("address") as string | null;

  await prisma.customer.create({
    data: { name, phone, email, address },
  });

  revalidatePath("/dashboard");
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}
