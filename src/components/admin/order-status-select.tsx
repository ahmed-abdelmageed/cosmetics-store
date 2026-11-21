"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner";
import { ORDER_STATUSES } from "@/lib/order-status";

export default function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: string) => {
    setLoading(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(t("genericError"));
      return;
    }
    toast.success(t("statusUpdated"));
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Spinner size={14} />}
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className="field !w-auto !py-1.5 !text-[13px] disabled:opacity-50"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {t(`status_${s}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
