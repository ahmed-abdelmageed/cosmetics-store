"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUploader from "./image-uploader";
import Spinner from "@/components/spinner";

type Category = { id: string; nameEn: string };

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

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductInput;
}) {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = form.id ? `/api/products/${form.id}` : "/api/products";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("An error occurred while saving");
      return;
    }
    toast.success("Saved successfully");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Product Name (English)</label>
          <input
            required
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">اسم المنتج (عربي)</label>
          <input
            required
            dir="rtl"
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Description (English)</label>
          <textarea
            required
            rows={4}
            value={form.descriptionEn}
            onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">الوصف (عربي)</label>
          <textarea
            required
            dir="rtl"
            rows={4}
            value={form.descriptionAr}
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Stock Quantity</label>
          <input
            type="number"
            required
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Discount %</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.discountPercent}
            onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            id="discountActive"
            type="checkbox"
            checked={form.discountActive}
            onChange={(e) => setForm({ ...form, discountActive: e.target.checked })}
          />
          <label htmlFor="discountActive" className="text-sm font-medium">
            Enable discount on this product
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={form.categoryId || ""}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Collection</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as ProductInput["gender"] })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          >
            <option value="UNISEX">Unisex</option>
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Show in Best Sellers
        </label>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Product Images</label>
        <ImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />
      </div>

      <button
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Spinner size={16} />}
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
