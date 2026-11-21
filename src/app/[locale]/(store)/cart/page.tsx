"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Trash2, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("cart");
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <p className="text-lg mb-4">{t("empty")}</p>
        <Link href="/shop" className="text-ink font-medium underline underline-offset-4">
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="font-display text-3xl md:text-4xl mb-8">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 card p-4">
              <div className="relative w-20 h-20 shrink-0 bg-cream rounded-[4px] overflow-hidden">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-ink font-medium">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-line rounded-[4px]">
                    <button
                      className="p-1.5"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      className="p-1.5"
                      onClick={() =>
                        updateQuantity(item.id, Math.min(item.stock || 99, item.quantity + 1))
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-ink/40 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h2 className="font-semibold mb-4">{t("summary")}</h2>
          <div className="flex justify-between mb-2">
            <span>{t("total")}</span>
            <span className="font-bold">{formatPrice(totalPrice())}</span>
          </div>
          <Link
            href="/checkout"
            className="btn-primary w-full mt-5 py-3.5"
          >
            {t("checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
