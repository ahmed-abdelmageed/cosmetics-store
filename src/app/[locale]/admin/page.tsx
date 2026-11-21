import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { pickLocale } from "@/i18n/pick-locale";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_STYLES } from "@/lib/order-status";
import { Plus } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import StatusBadge from "@/components/admin/status-badge";

export const dynamic = "force-dynamic";

const LOW_STOCK = 5;
const DAYS = 14;

export default async function AdminHome() {
  const t = await getTranslations("admin");
  const locale = await getLocale();

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (DAYS - 1));

  const [customersCount, revenueAgg, statusGroups, recentOrders, lowStock, lowStockCount, periodOrders] =
    await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK } },
        orderBy: { stock: "asc" },
        take: 5,
        select: { id: true, nameEn: true, nameAr: true, stock: true, images: true },
      }),
      prisma.product.count({ where: { stock: { lte: LOW_STOCK } } }),
      prisma.order.findMany({
        where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
        select: { total: true, createdAt: true },
      }),
    ]);

  const statusCounts = Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all])) as Partial<
    Record<OrderStatus, number>
  >;
  const ordersCount = statusGroups.reduce((s, g) => s + g._count._all, 0);

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    return { date: d, total: 0 };
  });
  for (const o of periodOrders) {
    const idx = Math.floor((o.createdAt.getTime() - since.getTime()) / 86_400_000);
    if (days[idx]) days[idx].total += o.total;
  }
  const periodRevenue = days.reduce((s, d) => s + d.total, 0);
  const maxDay = Math.max(...days.map((d) => d.total), 1);
  const intlLocale = locale === "ar" ? "ar-EG" : "en-GB";
  const dateFmt = new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "short" });
  const todayFmt = new Intl.DateTimeFormat(intlLocale, { weekday: "long", day: "numeric", month: "long" });

  const kpis = [
    { label: t("revenue"), value: formatPrice(revenueAgg._sum.total ?? 0), hint: t("revenueSub") },
    { label: t("orders"), value: ordersCount, href: "/admin/orders" },
    { label: t("pendingOrders"), value: statusCounts.PENDING ?? 0, href: "/admin/orders" },
    { label: t("customers"), value: customersCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t("overview")}</h1>
          <p className="text-sm text-ink/50 mt-1">{todayFmt.format(new Date())}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary !py-2 !px-4">
          <Plus size={16} /> {t("newProduct")}
        </Link>
      </div>

      <div className="card grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
        {kpis.map((k, i) => {
          const body = (
            <>
              <p className="text-[13px] text-ink/55">{k.label}</p>
              <p className="text-2xl font-semibold text-ink mt-1.5 tabular-nums truncate">{k.value}</p>
              {k.hint && <p className="text-[11px] text-ink/40 mt-1">{k.hint}</p>}
            </>
          );
          const cls = `block p-5 border-line ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 3 ? "" : i % 2 === 0 ? "border-e" : "lg:border-e"}`;
          return k.href ? (
            <Link key={k.label} href={k.href} className={`${cls} hover:bg-ink/[0.02]`}>
              {body}
            </Link>
          ) : (
            <div key={k.label} className={cls}>
              {body}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5 md:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-ink">{t("revenue")}</p>
              <p className="text-xs text-ink/45 mt-0.5">
                {dateFmt.format(days[0].date)} – {dateFmt.format(days[DAYS - 1].date)}
              </p>
            </div>
            <p className="text-xl font-semibold text-ink tabular-nums">{formatPrice(periodRevenue)}</p>
          </div>
          <div className="h-44 flex items-end gap-1.5 md:gap-2 border-b border-line" dir="ltr">
            {days.map((d, i) => (
              <div key={i} className="group relative flex-1 h-full flex flex-col justify-end">
                <div
                  className="w-full rounded-t-[3px] bg-ink/80 group-hover:bg-brand-600"
                  style={{ height: d.total ? `${(d.total / maxDay) * 100}%` : "2px", opacity: d.total ? 1 : 0.15 }}
                />
                <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 z-10">
                  {dateFmt.format(d.date)} · {formatPrice(d.total)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-ink/40 mt-2" dir="ltr">
            <span>{dateFmt.format(days[0].date)}</span>
            <span>{dateFmt.format(days[DAYS - 1].date)}</span>
          </div>
        </div>

        <div className="card p-5 md:p-6">
          <p className="text-sm font-semibold text-ink mb-5">{t("ordersByStatus")}</p>
          <ul className="space-y-3">
            {ORDER_STATUSES.map((s) => {
              const n = statusCounts[s] ?? 0;
              return (
                <li key={s} className="text-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-ink/70">{t(`status_${s}`)}</span>
                    <span className="font-medium tabular-nums">{n}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_STYLES[s].dot}`}
                      style={{ width: `${ordersCount ? (n / ordersCount) * 100 : 0}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-line">
            <p className="text-sm font-semibold text-ink">{t("recentOrders")}</p>
            <Link href="/admin/orders" className="text-[13px] text-ink/60 hover:text-ink">
              {t("viewAll")}
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-6 py-10 text-sm text-center text-ink/50">{t("noOrders")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-ink/50 border-b border-line">
                    <th className="text-start font-medium px-5 md:px-6 py-2.5">{t("customer")}</th>
                    <th className="text-start font-medium px-5 md:px-6 py-2.5">{t("date")}</th>
                    <th className="text-start font-medium px-5 md:px-6 py-2.5">{t("status")}</th>
                    <th className="text-end font-medium px-5 md:px-6 py-2.5">{t("total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-line last:border-0">
                      <td className="px-5 md:px-6 py-3">
                        <p className="font-medium text-ink">{o.fullName}</p>
                        <p className="text-xs text-ink/45">{o.city}</p>
                      </td>
                      <td className="px-5 md:px-6 py-3 text-ink/60 whitespace-nowrap">{dateFmt.format(o.createdAt)}</td>
                      <td className="px-5 md:px-6 py-3">
                        <StatusBadge status={o.status} label={t(`status_${o.status}`)} />
                      </td>
                      <td className="px-5 md:px-6 py-3 text-end font-medium tabular-nums whitespace-nowrap">
                        {formatPrice(o.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-line">
            <p className="text-sm font-semibold text-ink">{t("lowStockTitle")}</p>
            <span className="text-xs text-ink/50 tabular-nums">{lowStockCount}</span>
          </div>
          {lowStock.length === 0 ? (
            <p className="px-6 py-10 text-sm text-center text-ink/50">{t("allStocked")}</p>
          ) : (
            <ul>
              {lowStock.map((p) => (
                <li key={p.id} className="border-b border-line last:border-0">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 px-5 md:px-6 py-3 hover:bg-ink/[0.02]">
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-cream shrink-0">
                      {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />}
                    </div>
                    <p className="flex-1 text-sm text-ink line-clamp-1">{pickLocale(locale, p.nameEn, p.nameAr)}</p>
                    <span className={`text-xs font-medium tabular-nums ${p.stock === 0 ? "text-red-700" : "text-ink/60"}`}>
                      {p.stock} {t("left")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
