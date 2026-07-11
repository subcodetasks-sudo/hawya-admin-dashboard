"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getDateFnsLocale } from "@/lib/date-fns-locale";

type Props = {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
};

export default function AnthropicDateRangePicker({ range, onRangeChange }: Props) {
  const t = useTranslations("ClaudeUsage.anthropic");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);

  const label = range?.from
    ? range.to
      ? `${format(range.from, "d MMM yyyy", { locale: dateLocale })} – ${format(range.to, "d MMM yyyy", { locale: dateLocale })}`
      : format(range.from, "d MMM yyyy", { locale: dateLocale })
    : t("report.selectRange");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="font-normal">
          <CalendarIcon className="size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={onRangeChange}
          locale={dateLocale}
          numberOfMonths={2}
          defaultMonth={range?.from}
        />
      </PopoverContent>
    </Popover>
  );
}
