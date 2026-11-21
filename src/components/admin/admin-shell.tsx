"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LayoutDashboard, Package, Images, ShoppingBag, Tags, ExternalLink, LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";

export default function AdminShell({
  user,
  pendingOrders,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  pendingOrders: number;
  children: React.ReactNode;
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/admin", label: t("overview"), icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: t("orders"), icon: ShoppingBag, badge: pendingOrders },
    { href: "/admin/products", label: t("products"), icon: Package },
    { href: "/admin/categories", label: t("categories"), icon: Tags },
    { href: "/admin/slides", label: t("slides"), icon: Images },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const initials = (user.name || user.email || "A")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="h-14 px-5 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="w-7 h-7 rounded-md bg-ink text-white font-display text-sm flex items-center justify-center">
            L
          </span>
          <span className="font-semibold text-[15px] text-ink">Lumière</span>
        </Link>
        <button className="lg:hidden text-ink/50" onClick={() => setOpen(false)} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 pt-2 space-y-0.5">
        {links.map((l) => {
          const active = isActive(l.href, l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] transition-colors",
                active ? "bg-white text-ink font-semibold shadow-[0_0_0_1px_var(--color-line)]" : "text-ink/70 hover:bg-ink/[0.04] hover:text-ink"
              )}
            >
              <l.icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span className="flex-1">{l.label}</span>
              {!!l.badge && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-md bg-ink/[0.07] text-ink text-[11px] font-semibold flex items-center justify-center">
                  {l.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] text-ink/70 hover:bg-ink/[0.04] hover:text-ink"
        >
          <ExternalLink size={17} strokeWidth={1.8} />
          {t("backToStore")}
        </Link>
        <div className="flex items-center gap-2.5 px-2.5 py-2.5 mt-2 border-t border-line pt-3">
          <span className="w-8 h-8 rounded-full bg-brand-200 text-brand-900 text-xs font-semibold flex items-center justify-center shrink-0">
            {initials}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-ink truncate">{user.name}</p>
            <p className="text-[11px] text-ink/50 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            title={t("signOut")}
            className="text-ink/40 hover:text-ink p-1"
          >
            <LogOut size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f3] lg:ps-60">
      <aside className="hidden lg:block fixed inset-y-0 start-0 w-60 bg-[#efede9] border-e border-line z-30">{sidebar}</aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-64 bg-[#efede9] shadow-xl">{sidebar}</aside>
        </div>
      )}

      <header className="sticky top-0 z-20 h-14 bg-[#f6f5f3]/90 backdrop-blur border-b border-line">
        <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
          <button className="lg:hidden p-1.5 -ms-1.5" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => router.replace(pathname, { locale: locale === "en" ? "ar" : "en" })}
            className="px-3 py-1.5 rounded-md text-[13px] border border-line bg-white hover:border-ink/30"
          >
            {locale === "en" ? "العربية" : "English"}
          </button>
        </div>
      </header>

      <main className="px-4 md:px-8 py-6 md:py-8 max-w-[1280px]">{children}</main>
    </div>
  );
}
