import { cn } from "@/lib/utils";
import { STATUS_LABELS, type Status } from "@/lib/types";

const styles: Record<Status, string> = {
  received:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  verified: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
  dispatched:
    "bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-200",
  resolved:
    "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
