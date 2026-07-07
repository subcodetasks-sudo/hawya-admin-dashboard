import { formatDistanceToNow } from "date-fns";

import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { toLocaleDigits } from "@/lib/format";

export function formatRelativeTime(value: string, locale: string) {
  const text = formatDistanceToNow(new Date(value), {
    locale: getDateFnsLocale(locale),
    addSuffix: true,
  });

  return toLocaleDigits(text, locale);
}
