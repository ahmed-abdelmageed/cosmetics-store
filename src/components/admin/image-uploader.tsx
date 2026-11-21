"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";
import Spinner from "@/components/spinner";

export default function ImageUploader({
  images,
  onChange,
  multiple = true,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
}) {
  const t = useTranslations("admin");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push(data.url);
      } else {
        toast.error(t("uploadFailed"));
      }
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={img} className="relative w-24 h-24 rounded-md overflow-hidden border border-line bg-cream">
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute top-1 end-1 bg-white/90 hover:bg-white text-ink rounded p-0.5 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-ink/20 hover:border-ink/40 rounded-md px-4 py-6 text-sm cursor-pointer bg-ink/[0.015] transition-colors">
        <span className="flex items-center gap-2 font-medium text-ink">
          {uploading ? <Spinner size={16} /> : <Upload size={16} />}
          {uploading ? t("uploading") : t("uploadImages")}
        </span>
        <span className="text-xs text-ink/45">{t("uploadHint")}</span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </label>
    </div>
  );
}
