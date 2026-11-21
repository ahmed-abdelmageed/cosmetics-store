"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import Spinner from "@/components/spinner";

type Category = { id: string; nameEn: string; nameAr: string; slug: string; _count?: { products: number } };

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameEn, nameAr }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(t("genericError"));
      return;
    }
    setNameEn("");
    setNameAr("");
    toast.success(t("added"));
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDeleteCategory"))) return;
    setDeletingId(id);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      toast.error(t("categoryInUse"));
      return;
    }
    toast.success(t("deleted"));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="card p-5 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <div>
          <label className="label">{t("categoryNameEn")}</label>
          <input required dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="field" />
        </div>
        <div>
          <label className="label">{t("categoryNameAr")}</label>
          <input required dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="field" />
        </div>
        <button disabled={loading} className="btn-primary !py-2.5">
          {loading ? <Spinner size={14} /> : <Plus size={16} />}
          {t("add")}
        </button>
      </form>

      <div className="card overflow-hidden">
        {categories.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("noCategories")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-ink/50 border-b border-line bg-ink/[0.015]">
                <th className="text-start font-medium px-4 py-2.5">{t("categoryNameEn")}</th>
                <th className="text-start font-medium px-4 py-2.5">{t("categoryNameAr")}</th>
                <th className="text-end font-medium px-4 py-2.5">{t("products")}</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink" dir="ltr">{c.nameEn}</td>
                  <td className="px-4 py-3 text-ink" dir="rtl">{c.nameAr}</td>
                  <td className="px-4 py-3 text-end tabular-nums text-ink/60">{c._count?.products ?? "—"}</td>
                  <td className="px-4 py-3 text-end">
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      title={t("delete")}
                      className="p-1.5 rounded text-ink/50 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === c.id ? <Spinner size={15} /> : <Trash2 size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
