"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Spinner from "@/components/spinner";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      toast.error("An error occurred while deleting");
      return;
    }
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <button onClick={handleDelete} disabled={loading} className="text-red-500 disabled:opacity-50">
      {loading ? <Spinner size={16} /> : <Trash2 size={16} />}
    </button>
  );
}
