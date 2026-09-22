"use client";

import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X, Globe } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const role = (session?.user as { role?: string } | undefined)?.role;

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="container-app flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-neutral-900">
          Lumière
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-amber-600">
            {t("home")}
          </Link>
          <Link href="/shop" className="hover:text-amber-600">
            {t("shop")}
          </Link>
          <Link href="/shop?gender=men" className="hover:text-amber-600">
            {t("men")}
          </Link>
          <Link href="/shop?gender=women" className="hover:text-amber-600">
            {t("women")}
          </Link>
          <Link href="/shop?onSale=1" className="hover:text-amber-600">
            {t("offers")}
          </Link>
          {role === "ADMIN" && (
            <Link href="/admin" className="hover:text-amber-600 flex items-center gap-1">
              <LayoutDashboard size={16} /> {t("dashboard")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={switchLocale}
            className="flex items-center gap-1 text-sm font-medium hover:text-amber-600"
            title="Switch language"
          >
            <Globe size={18} />
            {locale === "en" ? "AR" : "EN"}
          </button>

          <Link href="/cart" className="relative">
            <ShoppingBag size={22} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm">
                <User size={16} /> {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="text-amber-600 hover:text-neutral-800"
                title={t("logout")}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block text-sm font-medium hover:text-amber-600">
              {t("login")}
            </Link>
          )}

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="container-app py-3 flex flex-col gap-3 text-sm">
            <Link href="/" onClick={() => setOpen(false)}>{t("home")}</Link>
            <Link href="/shop" onClick={() => setOpen(false)}>{t("shop")}</Link>
            <Link href="/shop?gender=men" onClick={() => setOpen(false)}>{t("men")}</Link>
            <Link href="/shop?gender=women" onClick={() => setOpen(false)}>{t("women")}</Link>
            <Link href="/shop?onSale=1" onClick={() => setOpen(false)}>{t("offers")}</Link>
            {role === "ADMIN" && (
              <Link href="/admin" onClick={() => setOpen(false)}>{t("dashboard")}</Link>
            )}
            {session ? (
              <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className="text-right text-amber-600">
                {t("logout")}
              </button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>{t("login")}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
