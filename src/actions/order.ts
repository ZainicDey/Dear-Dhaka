"use server";

import { prisma } from "@/lib/prisma";

async function generateUniqueOrderNumber(): Promise<string> {
  let isUnique = false;
  let orderNumber = "";

  while (!isUnique) {
    orderNumber = `DD-${Math.floor(100000 + Math.random() * 900000)}`;
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
    });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return orderNumber;
}

export async function createOrder(data: {
  subtotal: number;
  discount: number;
  total: number;
  address: string;
  deliveryInstructions?: string;
  items: any;
}) {
  const orderNumber = await generateUniqueOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      subtotal: data.subtotal,
      discount: data.discount,
      total: data.total,
      address: data.address,
      deliveryInstructions: data.deliveryInstructions,
      items: data.items,
    },
  });

  return order.orderNumber;
}

export interface GetOrdersOptions {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export async function getOrders(options?: GetOrdersOptions) {
  const {
    search,
    dateFrom,
    dateTo,
    sortOrder = "newest",
    page = 1,
    limit = 20,
  } = options || {};

  const where: any = {};

  if (search) {
    where.orderNumber = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      where.createdAt.gte = from;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      where.createdAt.lte = to;
    }
  }

  const orderBy = {
    createdAt: sortOrder === "newest" ? ("desc" as const) : ("asc" as const),
  };

  const skip = (page - 1) * limit;

  const [orders, totalElements, aggregate] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
    prisma.order.aggregate({
      where,
      _sum: { total: true },
    }),
  ]);

  return {
    orders,
    total: totalElements,
    totalRevenue: aggregate._sum.total || 0,
    page,
    limit,
    totalPages: Math.ceil(totalElements / limit),
  };
}

export async function getOrderById(id: string) {
  return await prisma.order.findUnique({
    where: { id },
  });
}
