"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCartStore();
  const mounted = useHydrated();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "", notes: "" });
  const t = useTranslations("checkout");

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <p>{t("emptyCart")}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(t("error"));
      return;
    }
    clear();
    toast.success(t("success"));
    router.push("/");
  };

  return (
    <div className="container-app py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="md:col-span-2 card p-6 md:p-8 space-y-5">
        <h1 className="font-display text-2xl mb-1">{t("title")}</h1>
        <div>
          <label className="label">{t("fullName")}</label>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="label">{t("phone")}</label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="label">{t("city")}</label>
          <input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="label">{t("address")}</label>
          <textarea
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="field"
            rows={3}
          />
        </div>
        <div>
          <label className="label">{t("notes")}</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="field"
            rows={2}
          />
        </div>
        <div className="bg-cream text-ink/80 text-sm rounded-[4px] p-3">
          {t("cod")}
        </div>
        <button
          disabled={loading}
          className="btn-primary w-full py-3.5"
        >
          {loading && <Spinner size={16} />}
          {loading ? t("confirming") : t("confirm")}
        </button>
      </form>

      <div className="card p-6 h-fit">
        <h2 className="font-semibold mb-4">{t("summary")}</h2>
        {items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm mb-2">
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4 pt-4 border-t border-line">
          <span>{t("total")}</span>
          <span>{formatPrice(totalPrice())}</span>
        </div>
      </div>
    </div>
  );
}
