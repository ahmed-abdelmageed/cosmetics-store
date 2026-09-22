import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/order-status-select";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-neutral-200 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold">{order.fullName} — {order.phone}</p>
                <p className="text-xs text-gray-500">
                  {order.city}, {order.address}
                </p>
                <p className="text-xs text-gray-400">{order.user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-700">{formatPrice(order.total)}</span>
                <OrderStatusSelect id={order.id} status={order.status} />
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {order.items.map((item) => (
                <p key={item.id}>
                  {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                </p>
              ))}
            </div>
            {order.notes && <p className="text-xs text-gray-400 mt-2">Notes: {order.notes}</p>}
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
}
