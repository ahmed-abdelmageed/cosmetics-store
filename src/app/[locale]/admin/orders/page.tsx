import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { formatPrice } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/order-status";
import OrderStatusSelect from "@/components/admin/order-status-select";
import { MapPin, Phone, Mail, StickyNote, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const t = await getTranslations("admin");
  const locale = await getLocale();
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t("orders")}</h1>
          <p className="text-sm text-ink/50 mt-1">{t("ordersCount", { count: orders.length })}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card py-20 flex flex-col items-center text-ink/40">
          <ShoppingBag size={36} strokeWidth={1.4} />
          <p className="mt-3 text-sm">{t("noOrders")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line bg-ink/[0.015]">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLES[order.status].dot}`} />
                  <span className="font-mono text-xs text-ink/50">#{order.id.slice(-8).toUpperCase()}</span>
                  <span className="text-xs text-ink/40">{dateFmt.format(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-ink tabular-nums">{formatPrice(order.total)}</span>
                  <OrderStatusSelect id={order.id} status={order.status} />
                </div>
              </div>

              <div className="grid md:grid-cols-[1fr_1.3fr] gap-6 p-5">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-ink">{order.fullName}</p>
                  <p className="flex items-center gap-2 text-ink/60">
                    <Phone size={14} /> <span dir="ltr">{order.phone}</span>
                  </p>
                  <p className="flex items-start gap-2 text-ink/60">
                    <MapPin size={14} className="mt-0.5 shrink-0" /> {order.city}, {order.address}
                  </p>
                  <p className="flex items-center gap-2 text-ink/45 text-xs">
                    <Mail size={13} /> {order.user.email}
                  </p>
                  {order.notes && (
                    <p className="flex items-start gap-2 text-xs bg-cream text-ink/75 rounded px-3 py-2 mt-3">
                      <StickyNote size={13} className="mt-0.5 shrink-0" /> {order.notes}
                    </p>
                  )}
                </div>
                <ul className="divide-y divide-ink/[0.05] text-sm">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-2 first:pt-0">
                      <span className="text-ink/80">
                        {item.name} <span className="text-ink/40">× {item.quantity}</span>
                      </span>
                      <span className="font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
