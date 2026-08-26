# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # install dependencies
npm run dev    # start dev server (Vite, port 3001, opens browser automatically)
npm run build  # production build, output to ./build
```

There is no lint, test, or typecheck script configured (no `tsconfig.json` either — Vite transpiles TSX but does not type-check). Verify changes by running the dev server and exercising the affected page manually.

## Architecture

This is a single-page React app (Vite + `@vitejs/plugin-react-swc`, no router) for "Chống lừa đảo Japan" — a scam-reporting / business-trust-verification site with public pages, a business self-service portal, and an admin dashboard. It's the frontend for [chongluadao-be](../chongluadao-be) (Express/TypeScript/MySQL); see [docs/CONVENTIONS.md](docs/CONVENTIONS.md) for services-layer, copy, and component conventions not covered below, [docs/FEATURES.md](docs/FEATURES.md) for which pages/admin tabs are wired to real endpoints vs. still mock data, and that repo's `docs/API_REFERENCE.md`/`docs/API_CONVENTIONS.md` for the endpoint catalog and request/response contract.

### Page routing without a router

[App.tsx](src/App.tsx) is the sole router: it holds `currentPage` state and a `renderPage()` switch statement that maps string page names (`'home'`, `'report'`, `'lookup'`, `'shop-detail'`, `'admin'`, `'business-portal'`, etc.) to components. Navigation between pages is done by calling `onNavigate(page, id?)` props passed down from `App`, not via URL changes — there's no `react-router`. `admin`, `login`, `register`, and `business-portal` render without the shared `Header`/`Footer` chrome; every other page gets it. Role-gated pages (`admin`, `business-portal`) check `user.role` in `renderPage()` and fall back to `LoginPage` if the role doesn't match.

### Auth

[services/authService.ts](src/services/authService.ts) stores `accessToken` + `user` JSON in `localStorage` (not cookies) and exposes `authenticatedFetch`, which auto-attaches the bearer token and transparently retries once on a 401 by calling `refreshAccessToken` (refresh token lives in an httpOnly cookie via `credentials: 'include'`). Concurrent 401s are coalesced through a `refreshSubscribers` queue so only one refresh request fires at a time. If refresh fails, auth data is cleared and the app hard-redirects to `/`. When adding authenticated API calls, use this `authenticatedFetch` (or the equivalent private helper duplicated in `adminService.ts`) rather than raw `fetch`.

### Services layer

Each domain has its own file under [services/](src/services/) (`authService`, `adminService`, `businessService`, `reportService`, `searchService`) that talks directly to the REST API at `import.meta.env.VITE_API_BASE_URL` (see `.env`, e.g. `http://localhost:3000/api/v1`) — there is no shared API client/axios instance; each service builds its own `fetch` calls and error messages (many in Vietnamese, matching the target audience). `adminService.ts` prefixes its own `authenticatedFetch` wrapper with `${API_BASE_URL}/admin`.

Image uploads (evidence photos, business logos) go through a presigned-S3 flow in `reportService.ts`: `POST /uploads/presign` to get a `{ uploadUrl, publicUrl }` pair, then `PUT` the file directly to S3. `uploadImageToS3` from `reportService.ts` is re-exported/used by `businessService.ts` — don't duplicate upload logic there. Note: `src/BACKEND_CLOUDINARY_EXAMPLE.md` describes an older Cloudinary-based upload design that has since been replaced by this S3 presign flow; treat that doc as stale.

### Components

[components/](src/components/) holds page-level components (one per `App.tsx` route) plus shared chrome (`Header`, `Footer`, `LoadingOverlay`). [components/ui/](src/components/ui/) is the shadcn/Radix UI primitive library (accordion, dialog, select, etc.) — treat these as generated/vendored, prefer composing them rather than editing internals. [components/figma/](src/components/figma/) contains Figma-import helpers. Path alias `@` resolves to `src/` (see [vite.config.ts](vite.config.ts)).

### Styling is a frozen, pre-built Tailwind stylesheet — not a live compiler

[src/index.css](src/index.css) is a **static, pre-generated Tailwind v4 output file** (~4300 lines, checked in as-is, starts with `/*! tailwindcss v4.1.3 ... */`) — there is no Tailwind compiler running in this project at all: `tailwindcss` is not in `package.json`/`node_modules`, there's no `tailwind.config.*`/`postcss.config.*`, and `vite.config.ts`'s plugin list is just `[react()]`. (`tailwind-merge` *is* a dependency, but that's only the `cn()` class-merging helper used at runtime — unrelated to compiling utility classes into CSS.)

**Practical consequence**: any Tailwind utility class combination that wasn't already emitted into `index.css` at generation time renders as a no-op — no error, no warning, the class is simply absent from the stylesheet. Before using an unusual class (especially a `<breakpoint>:<utility>` pairing like `sm:hidden` that may not already exist even though `sm:flex`/`md:hidden`/`lg:hidden` do), grep for it first: `grep -c '\.sm\\:hidden' src/index.css` (note the escaped colon). If it's not there, either find an existing class combination that achieves the same effect (e.g. swap to a breakpoint that's already used elsewhere for `hidden`), or don't rely on a brand-new class — verify visually (a screenshot, not just "the dev server didn't error") before considering a style change done, since Vite/React will happily apply a class to the DOM that has zero effect.

### Dependency version-pinned import aliases

[vite.config.ts](vite.config.ts) aliases versioned import specifiers (e.g. `'sonner@2.0.3'`, `'lucide-react@0.487.0'`) to their unversioned package names — this is a leftover from the Figma-generated code bundle. Existing imports like `import { Toaster } from 'sonner@2.0.3'` are intentional and resolve correctly; don't "fix" them to unversioned imports unless you also remove the corresponding alias.
