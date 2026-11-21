"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Spinner from "@/components/spinner";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t("confirmDeleteProduct"))) return;
    setLoading(true);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      toast.error(t("genericError"));
      return;
    }
    toast.success(t("deleted"));
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title={t("delete")}
      className="p-1.5 rounded text-ink/50 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? <Spinner size={15} /> : <Trash2 size={15} />}
    </button>
  );
}
