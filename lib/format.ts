// "ar" alone defaults to Western digits in most ICU builds — only "ar-SA"
// style locales default to Eastern Arabic numerals. Force it so ar always
// renders ١٢٣ per .cursor/i18n.md.
function numberingSystemFor(locale: string): Intl.NumberFormatOptions {
  return locale.startsWith("ar") ? { numberingSystem: "arab" } : {};
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, {
    ...numberingSystemFor(locale),
    ...options,
  }).format(value);
}

export function formatCurrency(
  amount: number,
  currency: string,
  locale: string,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: amount >= 1000 ? 0 : 2,
    ...numberingSystemFor(locale),
    ...options,
  }).format(amount);
}

export function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "always",
    ...numberingSystemFor(locale),
  }).format(value / 100);
}

const EASTERN_ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// date-fns doesn't localize digits, only month/weekday names — use this to
// transliterate any digits it renders (e.g. day-of-month) for ar locales.
export function toLocaleDigits(text: string, locale: string) {
  if (!locale.startsWith("ar")) {
    return text;
  }

  return text.replace(/[0-9]/g, (digit) => EASTERN_ARABIC_DIGITS[Number(digit)]);
}
