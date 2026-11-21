"use client";

import { useSession, signOut } from "next-auth/react";
import { useCartDrawer, useCartStore } from "@/lib/cart-store";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X, Globe } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const { show: openCart, pulse } = useCartDrawer();
  // false during SSR, true after hydration (cart lives in localStorage)
  const mounted = useHydrated();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Hide when scrolling down past the header, reveal on any upward scroll.
      if (y > 160 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y <= 160) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const role = (session?.user as { role?: string } | undefined)?.role;
  const switchLocale = () => router.replace(pathname, { locale: locale === "en" ? "ar" : "en" });
  const closeMenu = () => setMenuOpen(false);

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
          "sticky top-0 z-40 transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "bg-background/90 backdrop-blur-md border-b border-line" : "bg-background border-b border-transparent",
          hidden && !menuOpen && "-translate-y-full"
        )}
      >
        <div className="container-app grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-[72px]">
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="group relative py-1 text-ink/75 hover:text-ink transition-colors">
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-ink scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out ltr:origin-left rtl:origin-right" />
              </Link>
            ))}
          </nav>
          <button className="md:hidden justify-self-start p-2 -ms-2" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>

          <Link href="/" className="justify-self-center">
            <span className="font-display text-2xl md:text-[1.75rem] font-semibold text-ink">Lumière</span>
          </Link>

          <div className="justify-self-end flex items-center gap-1 md:gap-2">
            <button
              onClick={switchLocale}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-full text-xs font-semibold hover:bg-ink/5 transition-colors"
              title="Switch language"
            >
              <Globe size={16} />
              {locale === "en" ? "العربية" : "English"}
            </button>

            {role === "ADMIN" && (
              <Link href="/admin" className="hidden md:flex p-2 rounded-full hover:bg-ink/5 transition-colors" title={t("dashboard")}>
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
                  className="p-2 rounded-full hover:bg-ink/5 transition-colors"
                  title={t("logout")}
                >
                  <LogOut size={17} className="rtl:rotate-180" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex p-2 rounded-full hover:bg-ink/5 transition-colors" title={t("login")}>
                <User size={19} />
              </Link>
            )}

            <button onClick={openCart} className="relative p-2 rounded-full hover:bg-ink/5 transition-colors" title={t("cart")}>
              <ShoppingBag size={20} />
              {mounted && totalItems > 0 && (
                <span
                  key={pulse}
                  className="absolute top-0.5 end-0.5 bg-ink text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center animate-bump"
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: slides in from the start side */}
      <div className={clsx("md:hidden fixed inset-0 z-50", !menuOpen && "pointer-events-none")} aria-hidden={!menuOpen}>
        <div
          onClick={closeMenu}
          className={clsx("absolute inset-0 bg-ink/40 transition-opacity duration-300", menuOpen ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={clsx(
            "absolute inset-y-0 start-0 w-[84%] max-w-sm bg-background flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            menuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-16 px-5 border-b border-line">
            <span className="font-display text-xl">Lumière</span>
            <button onClick={closeMenu} className="p-2 -me-2" aria-label="Close">
              <X size={22} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-2">
            {[{ href: "/", label: t("home") }, ...links].map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                className={clsx(
                  "block py-4 border-b border-line text-lg font-display transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  menuOpen ? "opacity-100 translate-x-0" : "opacity-0 ltr:-translate-x-4 rtl:translate-x-4"
                )}
                style={{ transitionDelay: menuOpen ? `${120 + i * 50}ms` : "0ms" }}
              >
                {l.label}
              </Link>
            ))}
            {role === "ADMIN" && (
              <Link href="/admin" onClick={closeMenu} className="flex items-center gap-2 py-4 border-b border-line">
                <LayoutDashboard size={17} /> {t("dashboard")}
              </Link>
            )}
          </nav>
          <div className="px-5 py-5 border-t border-line flex items-center justify-between">
            {session ? (
              <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className="text-sm font-medium underline underline-offset-4">
                {t("logout")}
              </button>
            ) : (
              <Link href="/login" onClick={closeMenu} className="text-sm font-medium underline underline-offset-4">
                {t("login")}
              </Link>
            )}
            <button onClick={switchLocale} className="flex items-center gap-1.5 text-sm font-semibold">
              <Globe size={16} />
              {locale === "en" ? "العربية" : "English"}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
