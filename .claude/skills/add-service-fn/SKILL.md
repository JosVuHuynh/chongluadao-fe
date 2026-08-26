---
name: add-service-fn
description: Add a new API-calling function to one of the domain files under src/services (authService, adminService, businessService, reportService, searchService), following this app's fetch/error-handling conventions. Use when a page needs to call a backend endpoint that doesn't have a frontend wrapper yet.
---

# Add a service function

Every backend call goes through a function in `src/services/<domain>Service.ts` — never `fetch` directly from a component.

## Steps

1. **Pick the right file** by domain (auth, admin-only, business, report, search) — don't create a new service file for a single function if an existing one fits; `adminService.ts` in particular already covers most admin CRUD.
2. **Check the backend contract first**: read the corresponding endpoint in `../chongluadao-be` (its `docs/API_CONVENTIONS.md` and the actual route/controller/service) for the exact request body, response shape, and error format — don't guess field names or casing, since the backend is inconsistent about camelCase vs snake_case per resource.
3. **Auth**: if the endpoint requires login, call it via `authenticatedFetch` (from `authService.ts`) with the full URL (`${API_BASE_URL}/...`). If public, use plain `fetch`; only add `credentials: 'include'` if the endpoint actually needs cookies (e.g. auth flows).
4. **Errors**: wrap in `try { ... } catch { ... }`, and on a non-`ok` response throw `new Error(<Vietnamese, user-facing message>)` — check the response status/body the way `authService.ts#login` and `businessService.ts#registerBusiness` do, rather than surfacing the raw error object to the caller.
5. **Types**: define/extend a TypeScript interface for the request and response in the same service file (this codebase keeps types per-service, not in a shared types module).
6. **Lists**: if this is a paginated list endpoint, build the query string with `URLSearchParams` appended param-by-param (see `adminService.ts`), and expect the backend's `{ data, pagination }` shape.
7. **Uploads**: if the function needs to upload an image, call `uploadImageToS3` from `reportService.ts` — don't write a new upload implementation.

Finish by naming the exported function and confirming which component(s) will call it (or note that the caller still needs to be wired up if this was requested standalone).
