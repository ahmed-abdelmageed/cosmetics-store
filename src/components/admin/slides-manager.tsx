"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import ImageUploader from "./image-uploader";
import Spinner from "@/components/spinner";

type Slide = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string | null;
  subtitleAr: string | null;
  image: string;
  link: string | null;
  order: number;
  active: boolean;
};

export default function SlidesManager({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    titleEn: "",
    titleAr: "",
    subtitleEn: "",
    subtitleAr: "",
    image: "",
    link: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      toast.error("Please upload an image for the slide");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, active: true }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("An error occurred");
      return;
    }
    setForm({ titleEn: "", titleAr: "", subtitleEn: "", subtitleAr: "", image: "", link: "", order: 0 });
    toast.success("Added successfully");
    router.refresh();
  };

  const toggleActive = async (slide: Slide) => {
    setBusyId(slide.id);
    await fetch(`/api/slides/${slide.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !slide.active }),
    });
    setBusyId(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    setBusyId(id);
    await fetch(`/api/slides/${id}`, { method: "DELETE" });
    setBusyId(null);
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 max-w-xl">
        <h2 className="font-bold">Add New Slide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Title (English)</label>
            <input
              required
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">العنوان (عربي)</label>
            <input
              required
              dir="rtl"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Subtitle (English, optional)</label>
            <input
              value={form.subtitleEn}
              onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })}
              className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">العنوان الفرعي (عربي، اختياري)</label>
            <input
              dir="rtl"
              value={form.subtitleAr}
              onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
              className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Link on click (optional)</label>
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="/shop"
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Order</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full mt-1 border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Slide Image</label>
          <ImageUploader
            images={form.image ? [form.image] : []}
            onChange={(imgs) => setForm({ ...form, image: imgs[imgs.length - 1] || "" })}
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus size={16} /> {loading ? "Adding..." : "Add Slide"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((s) => (
          <div key={s.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <div className="relative h-32 bg-neutral-50">
              <Image src={s.image} alt={s.titleEn} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{s.titleEn}</h3>
              <p className="text-xs text-gray-500 mb-3">Order: {s.order}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleActive(s)}
                  disabled={busyId === s.id}
                  className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 disabled:opacity-50 ${
                    s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {busyId === s.id && <Spinner size={12} />}
                  {s.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => handleDelete(s.id)} disabled={busyId === s.id} className="text-red-500 disabled:opacity-50">
                  {busyId === s.id ? <Spinner size={16} /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
