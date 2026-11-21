import type { OrderStatus } from "@prisma/client";
import { STATUS_STYLES } from "@/lib/order-status";

export default function StatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status].pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[status].dot}`} />
      {label}
    </span>
  );
}
