"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";
import Spinner from "@/components/spinner";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
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
        toast.error("Failed to upload one of the images");
      }
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, i) => (
          <div key={img} className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-300">
            <Image src={img} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 border border-dashed border-neutral-400 rounded-lg px-4 py-3 text-sm text-amber-600 cursor-pointer w-fit">
        {uploading ? <Spinner size={16} /> : <Upload size={16} />}
        {uploading ? "Uploading..." : "Upload Images"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </label>
    </div>
  );
}
