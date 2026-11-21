"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import toast from "react-hot-toast";
import ImageUploader from "./image-uploader";
import Spinner from "@/components/spinner";
import { pickLocale } from "@/i18n/pick-locale";

type Category = { id: string; nameEn: string; nameAr: string };

type ProductInput = {
  id?: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  discountPercent: number;
  discountActive: boolean;
  stock: number;
  images: string[];
  categoryId: string | null;
  gender: "MEN" | "WOMEN" | "UNISEX";
  featured: boolean;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <h2 className="text-sm font-semibold text-ink mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Toggle({
  id,
  checked,
  onChange,
  label,
  hint,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-ink"
      />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="block text-xs text-ink/50 mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

export default function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductInput }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const locale = useLocale();
  const [form, setForm] = useState<ProductInput>(
    initial || {
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      price: 0,
      discountPercent: 0,
      discountActive: false,
      stock: 0,
      images: [],
      categoryId: null,
      gender: "UNISEX",
      featured: false,
    }
  );
  const [loading, setLoading] = useState(false);
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(form.id ? `/api/products/${form.id}` : "/api/products", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(t("genericError"));
      return;
    }
    toast.success(t("saved"));
    router.push(`/${locale}/admin/products`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      <div className="xl:col-span-2 space-y-6">
        <Section title={t("sectionDetails")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">{t("productNameEn")}</label>
              <input required dir="ltr" value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className="field" />
            </div>
            <div>
              <label className="label">{t("productNameAr")}</label>
              <input required dir="rtl" value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="field" />
            </div>
            <div>
              <label className="label">{t("descriptionEn")}</label>
              <textarea
                required
                dir="ltr"
                rows={5}
                value={form.descriptionEn}
                onChange={(e) => set("descriptionEn", e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="label">{t("descriptionAr")}</label>
              <textarea
                required
                dir="rtl"
                rows={5}
                value={form.descriptionAr}
                onChange={(e) => set("descriptionAr", e.target.value)}
                className="field"
              />
            </div>
          </div>
        </Section>

        <Section title={t("sectionMedia")}>
          <ImageUploader images={form.images} onChange={(images) => set("images", images)} />
        </Section>

        <Section title={t("sectionPricing")}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">{t("priceEgp")}</label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className="field tabular-nums"
              />
            </div>
            <div>
              <label className="label">{t("discountPercent")}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discountPercent}
                onChange={(e) => set("discountPercent", Number(e.target.value))}
                className="field tabular-nums"
              />
            </div>
            <div>
              <label className="label">{t("stockQty")}</label>
              <input
                type="number"
                required
                min={0}
                value={form.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
                className="field tabular-nums"
              />
            </div>
          </div>
          <Toggle
            id="discountActive"
            checked={form.discountActive}
            onChange={(v) => set("discountActive", v)}
            label={t("discountActive")}
            hint={t("discountActiveHint")}
          />
        </Section>
      </div>

      <div className="space-y-6 xl:sticky xl:top-20">
        <Section title={t("sectionOrganization")}>
          <div>
            <label className="label">{t("category")}</label>
            <select
              value={form.categoryId || ""}
              onChange={(e) => set("categoryId", e.target.value || null)}
              className="field"
            >
              <option value="">{t("noCategory")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {pickLocale(locale, c.nameEn, c.nameAr)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("collection")}</label>
            <select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value as ProductInput["gender"])}
              className="field"
            >
              <option value="UNISEX">{t("gender_UNISEX")}</option>
              <option value="WOMEN">{t("gender_WOMEN")}</option>
              <option value="MEN">{t("gender_MEN")}</option>
            </select>
          </div>
          <Toggle
            id="featured"
            checked={form.featured}
            onChange={(v) => set("featured", v)}
            label={t("featured")}
            hint={t("featuredHint")}
          />
        </Section>

        <div className="flex gap-3">
          <Link href="/admin/products" className="btn-secondary flex-1">
            {t("cancel")}
          </Link>
          <button disabled={loading} className="btn-primary flex-1">
            {loading && <Spinner size={16} />}
            {loading ? t("saving") : t("saveProduct")}
          </button>
        </div>
      </div>
    </form>
  );
}
