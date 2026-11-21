"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useCartDrawer, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

export default function CartDrawer() {
  const t = useTranslations("cart");
  const { open, hide } = useCartDrawer();
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const pathname = usePathname();
  // Keep the panel mounted while its exit transition plays.
  const [rendered, setRendered] = useState(open);

  if (open && !rendered) setRendered(true);

  // Close when the route changes (e.g. browser back).
  useEffect(() => {
    useCartDrawer.getState().hide();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, hide]);

  if (!rendered) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      onTransitionEnd={(e) => e.target === e.currentTarget.lastElementChild && !open && setRendered(false)}
    >
      <div
        onClick={hide}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100 animate-fade" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label={t("drawerTitle")}
        className={`absolute inset-y-0 end-0 w-full max-w-[420px] bg-background flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0 drawer-end animate-drawer-in" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-line">
          <h2 className="font-display text-xl text-ink">
            {t("drawerTitle")}
            {items.length > 0 && <span className="text-ink/45 text-base ms-2">({items.reduce((s, i) => s + i.quantity, 0)})</span>}
          </h2>
          <button onClick={hide} aria-label={t("close")} className="p-2 -me-2 rounded-full hover:bg-ink/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} strokeWidth={1.2} className="text-ink/25" />
            <p className="text-ink/60">{t("empty")}</p>
            <Link href="/shop" onClick={hide} className="btn-primary">
              {t("browse")}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 divide-y divide-line">
              {items.map((item, i) => (
                <li
                  key={item.id}
                  className="flex gap-4 py-5 animate-rise"
                  style={{ animationDelay: open ? `${80 + i * 60}ms` : undefined }}
                >
                  <div className="relative w-20 aspect-[4/5] rounded overflow-hidden bg-cream shrink-0">
                    {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-sm text-ink leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-sm font-medium text-ink mt-1">{formatPrice(item.price)}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex items-center border border-line rounded-[4px]">
                        <button
                          className="p-1.5 text-ink/60 hover:text-ink disabled:opacity-30"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums">{item.quantity}</span>
                        <button
                          className="p-1.5 text-ink/60 hover:text-ink disabled:opacity-30"
                          disabled={item.quantity >= (item.stock || 99)}
                          onClick={() => updateQuantity(item.id, Math.min(item.stock || 99, item.quantity + 1))}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-ink/50 hover:text-ink underline underline-offset-4"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-6 py-5 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink/70">{t("subtotal")}</span>
                <span className="text-lg font-semibold text-ink tabular-nums">{formatPrice(totalPrice())}</span>
              </div>
              <p className="text-xs text-ink/50">{t("drawerNote")}</p>
              <Link href="/checkout" onClick={hide} className="btn-primary w-full py-3.5">
                {t("checkout")}
              </Link>
              <Link href="/cart" onClick={hide} className="btn-secondary w-full">
                {t("viewCart")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
