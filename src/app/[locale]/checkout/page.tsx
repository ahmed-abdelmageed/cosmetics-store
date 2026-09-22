"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "", notes: "" });
  const t = useTranslations("checkout");

  useEffect(() => setMounted(true), []);

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
      <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-bold mb-2">{t("title")}</h1>
        <div>
          <label className="text-sm font-medium">{t("fullName")}</label>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("phone")}</label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("city")}</label>
          <input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("address")}</label>
          <textarea
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t("notes")}</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
            rows={2}
          />
        </div>
        <div className="bg-neutral-50 text-amber-700 text-sm rounded-lg p-3">
          {t("cod")}
        </div>
        <button
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Spinner size={16} />}
          {loading ? t("confirming") : t("confirm")}
        </button>
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 h-fit">
        <h2 className="font-bold mb-4">{t("summary")}</h2>
        {items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm mb-2">
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4 pt-4 border-t border-neutral-200">
          <span>{t("total")}</span>
          <span>{formatPrice(totalPrice())}</span>
        </div>
      </div>
    </div>
  );
}
