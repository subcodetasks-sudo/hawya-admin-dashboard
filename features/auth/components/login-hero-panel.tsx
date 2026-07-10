"use client";

import { Activity, BarChart3, CreditCard, ShieldCheck, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

import { formatNumber } from "@/lib/format";

interface HeroStat {
  key: "subscriptions" | "apiRequests" | "security" | "users";
  icon: LucideIcon;
  iconClassName: string;
  value: number;
  format: "count" | "compact" | "percent";
}

const STATS: HeroStat[] = [
  {
    key: "subscriptions",
    icon: CreditCard,
    iconClassName: "bg-blue-100 text-blue-600",
    value: 3840,
    format: "count",
  },
  {
    key: "apiRequests",
    icon: Activity,
    iconClassName: "bg-emerald-100 text-emerald-600",
    value: 1_200_000,
    format: "compact",
  },
  {
    key: "security",
    icon: ShieldCheck,
    iconClassName: "bg-orange-100 text-orange-600",
    value: 0.985,
    format: "percent",
  },
  {
    key: "users",
    icon: Users,
    iconClassName: "bg-teal-100 text-teal-600",
    value: 12_490,
    format: "count",
  },
];

function formatStatValue(stat: HeroStat, locale: string) {
  if (stat.format === "compact") {
    return formatNumber(stat.value, locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    });
  }

  if (stat.format === "percent") {
    return formatNumber(stat.value, locale, {
      style: "percent",
      maximumFractionDigits: 1,
    });
  }

  return formatNumber(stat.value, locale);
}

export default function LoginHeroPanel() {
  const t = useTranslations("Auth.hero");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-linear-to-br from-[#9BD149] via-[#82BF35] to-[#4E7F1E] p-10 text-white lg:flex lg:p-14">
      <div className="pointer-events-none absolute -inset-s-24 -top-24 size-72 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -inset-e-16 bottom-0 size-64 rounded-full bg-black/10 blur-3xl" />

      <div className="relative flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-white/15">
            <BarChart3 className="size-5" />
          </span>
          <span className="text-xl font-bold">{t("brand")}</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl leading-tight font-bold">
            <span className="block">{t("heading1")}</span>
            <span className="block">{t("heading2")}</span>
          </h1>
          <p className="max-w-sm text-white/80">{t("description")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm"
            >
              <span
                className={`flex size-10 items-center justify-center rounded-full ${stat.iconClassName}`}
              >
                <stat.icon className="size-5" />
              </span>
              <span className="text-2xl font-bold">{formatStatValue(stat, locale)}</span>
              <span className="text-sm text-white/70">{t(`stats.${stat.key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="relative text-sm text-white/60">{t("footer", { year })}</p>
    </div>
  );
}
