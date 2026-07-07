"use client";

import { Switch } from "@/components/ui/switch";

type Props = {
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function SettingsToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {description ? (
          <span className="text-xs text-muted-foreground">{description}</span>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
