---
name: add-page
description: Scaffold a new page component in this no-router React SPA and wire it into App.tsx's navigation switch. Use for adding a single new page/screen; for a larger multi-part feature (new page plus new service plus role-gating), prefer the page-builder agent.
---

# Add a page

This app has no `react-router` — `src/App.tsx` holds `currentPage` state and a `renderPage()` switch statement. Adding a page means adding a component and a case, not a route file.

## Steps

1. Pick a `page-name` string (kebab-case, e.g. `'faq'`) that isn't already a `case` in `App.tsx`.
2. Create `src/components/<PageName>.tsx` (PascalCase filename, named export matching). Accept `onNavigate(page: string, id?: number) => void` as a prop if the page needs to navigate elsewhere; add other callback props (`onSearch`, etc.) only as needed, following the pattern of similar existing pages.
3. In `App.tsx`:
   - Import the component.
   - Add `case '<page-name>': return <YourPage onNavigate={handleNavigate} ... />;` inside `renderPage()`.
   - If this page should render without the shared `Header`/`Footer` (like `admin`, `login`, `register`, `business-portal`), add `currentPage === '<page-name>'` to the condition near the bottom of `App.tsx` that picks the chrome-less layout branch.
   - If it's role-gated, put the `user && user.role === '...'` check inside the `case`, falling back to `<LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />` on failure — copy the `admin`/`business-portal` cases exactly.
4. If the page should be reachable from the nav bar or footer, add an `onClick={() => onNavigate('<page-name>')}` entry in `Header.tsx`/`Footer.tsx` following the existing nav item pattern there.
5. Style with Tailwind utility classes and `components/ui/*` primitives (shadcn/Radix) — check that directory before adding any new low-level UI element.
6. Vietnamese copy for all user-facing text, matching the tone of neighboring pages.

There's no type-check step (`npm run dev` doesn't catch TS errors) — double-check prop names/types against how the component is invoked in `App.tsx`, and mention to the user that the page should be exercised manually in the browser.
