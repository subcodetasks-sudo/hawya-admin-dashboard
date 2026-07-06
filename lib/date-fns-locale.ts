import { ar, enUS, type Locale } from "date-fns/locale";

export function getDateFnsLocale(locale: string): Locale {
  return locale === "ar" ? ar : enUS;
}
