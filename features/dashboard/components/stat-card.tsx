import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  deltaLabel?: string;
  direction?: "up" | "down";
  highlight?: boolean;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  deltaLabel,
  direction,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10",
        highlight
          ? "bg-primary text-white"
          : "bg-card text-card-foreground",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm",
            highlight ? "text-white" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        <span className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          highlight ? "bg-white/20" : "bg-muted",)}>
          <Icon
            className={cn(
              "size-4",
              highlight ? "text-white" : "text-muted-foreground",
            )}
          />
        </span>
      </div>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      {deltaLabel ? (
        <span
          className={cn(
            "flex items-center gap-1 text-xs",
            highlight
              ? "text-primary-foreground/90"
              : direction === "down"
                ? "text-destructive"
                : "text-success",
          )}
        >
          {direction === "down" ? (
            <TrendingDown className="size-3.5" />
          ) : (
            <TrendingUp className="size-3.5" />
          )}
          {deltaLabel}
        </span>
      ) : null}
    </div>
  );
}
