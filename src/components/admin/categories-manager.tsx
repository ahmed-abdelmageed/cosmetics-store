"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Spinner from "@/components/spinner";

type Category = { id: string; nameEn: string; nameAr: string; slug: string };

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
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
      toast.error("An error occurred");
      return;
    }
    setNameEn("");
    setNameAr("");
    toast.success("Added successfully");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      toast.error("Cannot delete a category linked to products");
      return;
    }
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          required
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Category name (English)"
          className="border border-neutral-300 rounded-lg px-3 py-2"
        />
        <input
          required
          dir="rtl"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          placeholder="اسم الفئة (عربي)"
          className="border border-neutral-300 rounded-lg px-3 py-2"
        />
        <button
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Spinner size={14} />}
          Add
        </button>
      </form>

      <div className="bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-50">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <span>
              {c.nameEn} <span className="text-gray-400">/ {c.nameAr}</span>
            </span>
            <button
              onClick={() => handleDelete(c.id)}
              disabled={deletingId === c.id}
              className="text-red-500 disabled:opacity-50"
            >
              {deletingId === c.id ? <Spinner size={16} /> : <Trash2 size={16} />}
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="p-6 text-center text-gray-500">No categories yet.</p>}
      </div>
    </div>
  );
}
