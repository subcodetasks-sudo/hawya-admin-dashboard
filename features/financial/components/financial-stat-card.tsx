import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: boolean;
};

export default function FinancialStatCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10",
        highlight ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-sm", highlight ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {label}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            highlight ? "bg-white/20" : "bg-muted",
          )}
        >
          <Icon className={cn("size-4", highlight ? "text-primary-foreground" : "text-muted-foreground")} />
        </span>
      </div>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  );
}
