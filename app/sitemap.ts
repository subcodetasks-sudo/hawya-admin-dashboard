import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

const PATHS = [
  "/",
  "/home",
  "/plans",
  "/subscriptions",
  "/users",
  "/claude-usage",
  "/financial",
  "/testimonials",
  "/settings",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: buildLocalizedUrl(siteUrl, locale, path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" || path === "/home" ? 1 : 0.6,
    })),
  );
}

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function buildLocalizedUrl(siteUrl: string, locale: string, path: string): string {
  // localePrefix: "as-needed" — default locale (ar) has no prefix.
  const localizedPath =
    locale === routing.defaultLocale
      ? path
      : path === "/"
        ? `/${locale}`
        : `/${locale}${path}`;

  return `${siteUrl}${localizedPath}`;
}
