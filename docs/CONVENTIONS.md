# Frontend conventions

Supplementary detail to the root [CLAUDE.md](../CLAUDE.md) — read that first for the routing/auth/services architecture. This file covers the smaller, easy-to-miss conventions found across existing pages and services.

## Backend contract

This app talks to [chongluadao-be](../../chongluadao-be) (Express + TypeScript + MySQL) at `VITE_API_BASE_URL`. That repo's `docs/API_CONVENTIONS.md` is the authoritative contract for request/response shapes, error format (`{ message }` or `{ message, errors }`), pagination (`{ data, pagination: { page, limit, totalItems, totalPages } }`), and the S3 presign upload flow. When a new frontend feature needs a backend change (or you're unsure what an endpoint returns), check that doc or the backend source rather than guessing from the frontend alone.

## Language and copy

User-facing text and error messages are Vietnamese by default (this is a Vietnamese-audience scam-reporting site) — match the tone/phrasing already used in the page you're editing rather than defaulting to English. Toasts go through `sonner@2.0.3`'s `toast()` (imported via the versioned specifier, see the root CLAUDE.md's note on `vite.config.ts` aliases), already wired up globally via `<Toaster position="top-right" richColors />` in `App.tsx` — don't add a second `Toaster`.

## Services layer patterns

- Public (unauthenticated) calls use plain `fetch` with `credentials: 'include'` only when the endpoint needs cookies (e.g. auth endpoints); most public reads don't need it.
- Authenticated calls use `authenticatedFetch` from `services/authService.ts` — never hand-roll a bearer-token fetch elsewhere.
- Error handling: catch, and throw a `new Error(<Vietnamese message>)` derived from the response status/body, matching the existing `try { ... } catch { throw new Error(...) }` shape in `authService.ts`/`businessService.ts` — don't introduce a different error convention (e.g. returning `{ error }` objects) in a new service.
- Query-string building for list endpoints uses `URLSearchParams`, appended manually per param (see `adminService.ts`'s `getUsers`/`getReports`/etc.) — follow that rather than a serialization library.
- Types/interfaces for API responses are defined per-service file (e.g. `Business`, `Scam` in `searchService.ts`), not shared in a central types file. Some fields exist in both camelCase and snake_case on the same interface (e.g. `verifiedBadge` / `verified_badge`) because the backend isn't consistent about casing — see the backend's `docs/API_CONVENTIONS.md#field-casing`. Don't "clean up" one without checking whether the backend actually sends the other.

## Image uploads

Always go through `uploadImageToS3` (defined in `reportService.ts`, re-used by `businessService.ts`) — it calls `POST /uploads/presign` then `PUT`s to S3. Never call Cloudinary; `src/BACKEND_CLOUDINARY_EXAMPLE.md` is stale documentation for a design that was replaced.

## Components

- Page components take an `onNavigate(page: string, id?: number) => void` prop (and sometimes `onSearch`, `onLogin`, `onLogout`) rather than reading global state — keep new pages consistent with this, since there's no router/context for navigation.
- Prefer composing from `components/ui/*` (shadcn/Radix primitives) over writing new low-level UI from scratch — check there first before adding a new dependency or hand-rolled dropdown/dialog/etc.
- Tailwind utility classes for styling; no CSS modules or styled-components elsewhere, don't introduce one.
- Role-gated pages (`admin`, `business-portal`) check `user.role` inside `App.tsx`'s `renderPage()`, not inside the page component itself — a new role-gated page should follow that same top-level check rather than guarding internally.

## What there isn't

No test runner, no lint config, no type-checking build step (Vite/SWC transpiles but doesn't check types) — a change that "compiles" via `npm run dev` can still have type errors. Manually exercise the affected page in the browser; there's no automated safety net.
