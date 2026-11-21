import type { OrderStatus } from "@prisma/client";

export const ORDER_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export const STATUS_STYLES: Record<OrderStatus, { dot: string; pill: string }> = {
  PENDING: { dot: "bg-amber-400", pill: "bg-amber-50 text-amber-800 ring-amber-200" },
  CONFIRMED: { dot: "bg-sky-500", pill: "bg-sky-50 text-sky-700 ring-sky-200" },
  SHIPPED: { dot: "bg-violet-500", pill: "bg-violet-50 text-violet-700 ring-violet-200" },
  DELIVERED: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  CANCELLED: { dot: "bg-rose-500", pill: "bg-rose-50 text-rose-700 ring-rose-200" },
};
