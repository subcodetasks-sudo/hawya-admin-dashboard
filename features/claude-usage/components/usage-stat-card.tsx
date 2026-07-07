import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type UsageStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  deltaLabel?: string;
  direction?: "up" | "down";
};

export default function UsageStatCard({
  icon: Icon,
  label,
  value,
  deltaLabel,
  direction,
}: UsageStatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </span>
      </div>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      {deltaLabel ? (
        direction ? (
          <span
            className={cn(
              "flex items-center gap-1 text-xs",
              direction === "down" ? "text-destructive" : "text-success",
            )}
          >
            {direction === "down" ? (
              <TrendingDown className="size-3.5" />
            ) : (
              <TrendingUp className="size-3.5" />
            )}
            {deltaLabel}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{deltaLabel}</span>
        )
      ) : null}
    </div>
  );
}
