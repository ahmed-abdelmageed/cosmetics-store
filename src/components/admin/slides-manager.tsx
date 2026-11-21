"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";
import ImageUploader from "./image-uploader";
import Spinner from "@/components/spinner";
import { pickLocale } from "@/i18n/pick-locale";

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

const EMPTY = { titleEn: "", titleAr: "", subtitleEn: "", subtitleAr: "", image: "", link: "", order: 0 };

export default function SlidesManager({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const locale = useLocale();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      toast.error(t("slideImageRequired"));
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
      toast.error(t("genericError"));
      return;
    }
    setForm(EMPTY);
    toast.success(t("added"));
    router.refresh();
  };

  const toggleActive = async (slide: Slide) => {
    setBusyId(slide.id);
    const res = await fetch(`/api/slides/${slide.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !slide.active }),
    });
    setBusyId(null);
    if (!res.ok) toast.error(t("genericError"));
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDeleteSlide"))) return;
    setBusyId(id);
    const res = await fetch(`/api/slides/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      toast.error(t("genericError"));
      return;
    }
    toast.success(t("deleted"));
    router.refresh();
  };

  const opt = <span className="text-ink/40 font-normal"> ({t("optional")})</span>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
      <div className="space-y-3">
        {slides.length === 0 && <div className="card p-10 text-center text-sm text-ink/50">{t("noSlides")}</div>}
        {slides.map((s) => (
          <div key={s.id} className="card p-3 flex items-center gap-4">
            <div className="relative w-32 sm:w-40 aspect-[16/9] rounded overflow-hidden bg-cream shrink-0">
              <Image src={s.image} alt="" fill sizes="160px" className={`object-cover ${s.active ? "" : "opacity-40"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-ink line-clamp-1">{pickLocale(locale, s.titleEn, s.titleAr)}</p>
              <p className="text-xs text-ink/50 mt-1">
                {t("position")}: {s.order} · {s.active ? t("active") : t("inactive")}
                {s.link && <span dir="ltr"> · {s.link}</span>}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleActive(s)}
                disabled={busyId === s.id}
                title={s.active ? t("inactive") : t("active")}
                className="p-1.5 rounded text-ink/50 hover:text-ink hover:bg-ink/5 disabled:opacity-50"
              >
                {busyId === s.id ? <Spinner size={15} /> : s.active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                disabled={busyId === s.id}
                title={t("delete")}
                className="p-1.5 rounded text-ink/50 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="card p-5 md:p-6 space-y-4 xl:sticky xl:top-20">
        <h2 className="text-sm font-semibold text-ink">{t("addSlide")}</h2>
        <div>
          <label className="label">{t("slideImage")}</label>
          <ImageUploader
            multiple={false}
            images={form.image ? [form.image] : []}
            onChange={(imgs) => setForm({ ...form, image: imgs[imgs.length - 1] || "" })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">{t("slideTitleEn")}</label>
            <input required dir="ltr" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label">{t("slideTitleAr")}</label>
            <input required dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label">{t("slideSubtitleEn")}{opt}</label>
            <input dir="ltr" value={form.subtitleEn} onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label">{t("slideSubtitleAr")}{opt}</label>
            <input dir="rtl" value={form.subtitleAr} onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label">{t("slideLink")}{opt}</label>
            <input dir="ltr" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/shop" className="field" />
          </div>
          <div>
            <label className="label">{t("slideOrder")}</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="field" />
          </div>
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner size={14} /> : <Plus size={16} />}
          {loading ? t("adding") : t("addSlide")}
        </button>
      </form>
    </div>
  );
}
