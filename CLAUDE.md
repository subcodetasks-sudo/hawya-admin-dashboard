# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Note on AGENTS.md:** it claims this is a non-standard Next.js build and directs you to
> `node_modules/next/dist/docs/` before writing code. That directory does not exist in this
> install (verified — `node_modules/next` has no `docs/`). Treat Next.js APIs as the standard
> `next@16` App Router; don't invent behavior to satisfy that instruction.

## Commands

- `npm run dev` — start dev server (Next.js, Turbopack default)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (`eslint-config-next` core-web-vitals + typescript)

No test runner is configured in this repo (no test script, no Jest/Vitest/Playwright config).

Both `package-lock.json` and `pnpm-lock.yaml` are present — confirm with the user which package manager is authoritative before adding dependencies.

## Architecture

Next.js App Router project, internationalized (Arabic/English) with `next-intl`, using TanStack Query for data fetching and shadcn/ui (`radix-nova` style) for UI primitives.

### i18n routing

- All routed pages live under `app/[locale]/`. Locale handling is defined in `i18n/routing.ts` (`locales: ["ar", "en"]`, `defaultLocale: "ar"`, `localePrefix: "as-needed"`, **`localeDetection: false`**).
- `proxy.ts` (not `middleware.ts`) wires `next-intl`'s middleware and matches all paths except `api`, `trpc`, `_next`, `_vercel`, and files with extensions.
- `i18n/request.ts` loads `messages/{locale}.json` server-side; `i18n/navigation.ts` exports locale-aware `Link`/`redirect`/`usePathname`/`useRouter`.
- `app/[locale]/layout.tsx` derives text direction from the locale itself (`RTL_LOCALES` set) rather than from `next-intl`, and wraps children in `DirectionProvider` (from `components/ui/direction`) + `NextIntlClientProvider`.
- Translation strings live in `messages/en.json` and `messages/ar.json` — both must be updated together for any new UI text (see `.cursor/i18n.md`). Use Tailwind logical properties (`ps-*`, `me-*`, `start-*`) instead of physical left/right utilities so RTL keeps working.

### Data fetching (server-first + React Query)

- `app/providers.tsx` sets up a single `QueryClientProvider` (`isServer`-aware client factory, `staleTime: 60s`), mounted once in the root locale layout.
- Intended pattern (per `.cursor/server-first.md` and `.cursor/react-query.md`): Server Components prefetch via `QueryClient.prefetchQuery` and hand off through `<HydrationBoundary state={dehydrate(queryClient)}>`; Client Components then read the same query via a hook (`useQuery(xQueryOptions)`), never via prop drilling. See `app/[locale]/page.tsx` + `features/home/src/queries/posts.ts` + `features/home/src/components/posts-list.tsx` for the reference shape — note the current `page.tsx` prefetches but does not actually wrap children in `HydrationBoundary` yet, so don't copy that part.
- Query keys are meant to go through a per-feature `query-keys.ts` factory (not inline arrays) and error toasts are meant to be centralized in `QueryCache`/`MutationCache` callbacks at client-construction time, not inside components/hooks. Neither exists yet in `app/providers.tsx` or any feature — this is aspirational convention, not current fact. Follow it for new code rather than inline `toast.error()` calls.

### Feature modules (`features/`)

Each feature is meant to expose `components/`, `hooks/`, and `services/` (per `.cursor/architecture.md`), kebab-case filenames, PascalCase component names, one component per file, regular `function` declarations (not arrow functions) for components and service functions, and an inline `export default function ComponentName()` for the primary component. Existing features don't fully match this yet (e.g. `features/notifications/components/NotificationBell.tsx` is PascalCase-named and uses an arrow-function `React.FC`, `features/home` nests everything under an extra `src/` folder). Match the convention for anything you add or touch, but don't feel obligated to silently rewrite unrelated existing files to match.

- **`features/home`** — demo posts list fetched from `jsonplaceholder.typicode.com`, wired through the query-options + hook pattern above.
- **`features/notifications`** — Firebase Cloud Messaging (web push).
  - `services/firebase-client.ts` initializes Firebase from `NEXT_PUBLIC_FIREBASE_*` env vars (see `.env.local`) and exposes `getFirebaseMessaging()` / `onForegroundMessage()`.
  - `hooks/use-fcm.ts` handles permission requests and device-token retrieval (needs a VAPID key, `NEXT_PUBLIC_FIREBASE_VAPID_KEY`).
  - `src/sw-template.js` is the background service-worker template (uses `firebase/messaging/sw`); `scripts/sync-sw.js` copies it out to `../../apps/*/public/firebase-messaging-sw.js` for **each app in a monorepo's `apps/` directory** — that layout doesn't exist in this repo (this app is not nested under `apps/`), so the sync script is currently a no-op here. If you need the service worker file served, it must be placed manually at `public/firebase-messaging-sw.js`.
  - `app/[locale]/notifications/page.tsx` is a manual test/debug page for the FCM flow, not end-user UI.
  - `index.ts` re-exports the feature's public surface (components/hooks/services/types) as a barrel file.
- **`features/uploads`** — client-side media upload pipeline feeding `app/api/uploads/*`.
  - `services/queue.ts` classifies files as image/video by MIME type with a filename-extension fallback (`isSupportedMediaFile`, `createQueue`).
  - `services/image-upload.ts` resizes images to a 1920×1080 box and re-encodes to WebP client-side (via canvas) before POSTing as `multipart/form-data` to `/api/uploads/image`.
  - `services/video-upload.ts` splits video files into 5 MB chunks, POSTs each to `/api/uploads/video/chunk`, then POSTs a merge request to `/api/uploads/video/merge`.
  - `components/upload-dialog.tsx` is the combined UI (tabs for images/videos, per-item progress, auto-upload on file select).
  - Server side: `app/api/uploads/video/store.ts` holds an **in-memory** `Map` (`globalThis.__videoChunkStore`) of in-flight chunked uploads — this does not survive server restarts/multiple instances and is a placeholder, not a durable store. The `image`/`video/chunk`/`video/merge` routes under `app/api/uploads/` currently just validate and echo metadata; they don't persist files anywhere real yet.

### UI primitives

- `components/ui/*` are shadcn/ui components (style `radix-nova`, base color `neutral`, icon library `lucide-react`), configured via `components.json`. Add new primitives with the shadcn CLI rather than hand-writing them, per `.cursor/components.md`. Business/feature UI belongs in `features/[name]/components`, composed from these primitives.
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) — the standard class-merging helper used throughout `components/ui`.
- `hooks/use-mobile.ts` (`useIsMobile`, 768px breakpoint) is a shared, non-feature-specific hook.

### Environment variables

`.env.local` (gitignored) defines: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_FIREBASE_*` set (API key, auth domain, database URL, project ID, storage bucket, messaging sender ID, app ID, VAPID key) consumed by the notifications feature.
