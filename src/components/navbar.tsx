"use client";

import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X, Globe } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const role = (session?.user as { role?: string } | undefined)?.role;

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "ar" : "en" });
  };

  const links = [
    { href: "/shop", label: t("shop") },
    { href: "/shop?gender=women", label: t("women") },
    { href: "/shop?gender=men", label: t("men") },
    { href: "/shop?onSale=1", label: t("offers") },
  ];

  return (
    <>
      <div className="bg-ink text-cream text-[11px] md:text-xs">
        <div className="container-app h-9 flex items-center justify-center">
          <span className="truncate">{t("announcement")}</span>
        </div>
      </div>

      <header
        className={clsx(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur border-b border-line"
            : "bg-background border-b border-transparent"
        )}
      >
        <div className="container-app grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-[72px]">
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative py-1 text-ink/80 hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            className="md:hidden justify-self-start p-2 -ms-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="justify-self-center text-center leading-none">
            <span className="font-display text-2xl md:text-[1.75rem] font-semibold text-ink">Lumière</span>
          </Link>

          <div className="justify-self-end flex items-center gap-1 md:gap-2">
            <button
              onClick={switchLocale}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-full text-xs font-semibold hover:bg-ink/5"
              title="Switch language"
            >
              <Globe size={16} />
              {locale === "en" ? "العربية" : "English"}
            </button>

            {role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden md:flex p-2 rounded-full hover:bg-ink/5"
                title={t("dashboard")}
              >
                <LayoutDashboard size={19} />
              </Link>
            )}

            {session ? (
              <div className="hidden md:flex items-center">
                <span className="flex items-center gap-1.5 text-xs font-medium px-2 max-w-[140px] truncate">
                  <User size={17} /> {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="p-2 rounded-full hover:bg-ink/5"
                  title={t("logout")}
                >
                  <LogOut size={17} className="rtl:rotate-180" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex p-2 rounded-full hover:bg-ink/5" title={t("login")}>
                <User size={19} />
              </Link>
            )}

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-ink/5" title={t("cart")}>
              <ShoppingBag size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0.5 end-0.5 bg-ink text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-ink/10 bg-background">
            <div className="container-app py-4 flex flex-col text-[15px]" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
              {[{ href: "/", label: t("home") }, ...links].map((l) => (
                <Link key={l.href} href={l.href} className="py-3 border-b border-ink/5 font-medium">
                  {l.label}
                </Link>
              ))}
              {role === "ADMIN" && (
                <Link href="/admin" className="py-3 border-b border-ink/5 font-medium flex items-center gap-2">
                  <LayoutDashboard size={16} /> {t("dashboard")}
                </Link>
              )}
              <div className="flex items-center justify-between pt-4">
                {session ? (
                  <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className="text-brand-700 font-medium">
                    {t("logout")}
                  </button>
                ) : (
                  <Link href="/login" className="text-brand-700 font-medium">
                    {t("login")}
                  </Link>
                )}
                <button onClick={switchLocale} className="flex items-center gap-1.5 text-sm font-semibold">
                  <Globe size={16} />
                  {locale === "en" ? "العربية" : "English"}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
