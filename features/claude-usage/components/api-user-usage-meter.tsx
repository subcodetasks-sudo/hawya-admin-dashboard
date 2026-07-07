import { toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

function usageBarColor(value: number) {
  if (value >= 85) {
    return "bg-destructive";
  }

  if (value >= 50) {
    return "bg-amber-500";
  }

  return "bg-primary";
}

type Props = {
  value: number;
  locale: string;
};

export default function ApiUserUsageMeter({ value, locale }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-9 shrink-0 text-xs tabular-nums text-muted-foreground">
        {toLocaleDigits(`${value}%`, locale)}
      </span>
      <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", usageBarColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
