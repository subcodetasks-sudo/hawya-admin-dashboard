import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_SEGMENTS = [
  "home",
  "plans",
  "subscriptions",
  "users",
  "claude-usage",
  "financial",
  "testimonials",
  "settings",
];

function splitLocale(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (routing.locales.includes(maybeLocale as (typeof routing.locales)[number])) {
    return { locale: maybeLocale, path: `/${segments.slice(2).join("/")}` };
  }

  return { locale: routing.defaultLocale, path: pathname };
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, path } = splitLocale(pathname);
  const normalizedPath = path === "" ? "/" : path;
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  const hasSession = Boolean(request.cookies.get("admin_token")?.value);
  const isLoginRoute = normalizedPath === "/";
  const isProtectedRoute = PROTECTED_SEGMENTS.some(
    (segment) => normalizedPath === `/${segment}` || normalizedPath.startsWith(`/${segment}/`),
  );

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL(`${localePrefix}/`, request.url));
  }

  if (isLoginRoute && hasSession) {
    return NextResponse.redirect(new URL(`${localePrefix}/home`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
