---
name: ship-check
description: Pre-ship quality gate for the portfolio site. Run before committing UI work, before deploying to Vercel, or when asked to "ship-check", QA, or audit a page. Covers build, responsive layout, console errors, accessibility, keyboard and reduced motion, links, image weight, metadata, and the design quality bar.
---

# Ship check

Verify; don't assume. Every PASS in the report must come from a command, screenshot, or measurement taken in this run. If a check couldn't run, mark it **SKIPPED** with the reason, never PASS.

**Scope:** the routes touched by the current change, plus `/` always. For a full audit, every route under `src/app/`.

## 1. Build

- `npm run lint`: no errors.
- `npm run build`: must succeed. From the route table, record **First Load JS** per route. Budget: ≤ 150 kB for `/` and case study routes. Flag any route over budget, and any route that grew by more than 20 kB in this change.

## 2. Run it

Prefer the production build for accuracy (`npm start` after building); use `npm run dev` only for quick passes. Open it in the browser pane (`preview_start`, using `.claude/launch.json`).

## 3. Responsive

For each route in scope, screenshot at **375×812**, **768×1024** and **1440×900**. At each size:
- No horizontal scroll: `document.documentElement.scrollWidth <= window.innerWidth`.
- No clipped or overlapping text, display type fits, touch targets ≥ 44px on mobile.
- Body copy line length ≤ ~80 characters at desktop.
- Reset the viewport to desktop when done.

## 4. Console and network

- `read_console_messages` after loading and interacting: zero errors, including hydration and `next/image` warnings.
- `read_network_requests`: no 404s. Total transfer for the first load of `/` ≤ ~1.5 MB; flag any single image > 300 kB served to a 375px viewport.

## 5. Accessibility

- **Automated:** inject axe-core (`https://cdn.jsdelivr.net/npm/axe-core/axe.min.js`) and run `await axe.run()`. Report violations with impact serious or critical by selector.
- **Structure:** exactly one `h1` per page; heading levels don't skip; `<html lang>` set; landmarks (`header`, `main`, `nav`, `footer`).
- **Keyboard:** Tab through the whole page. Every interactive element is reachable, has a visible focus style, and works with Enter/Space. No click handlers on non-interactive elements (`div`/`span`/`svg` with `onClick` → must be `button` or `a`). Icon-only links/buttons have `aria-label`.
- **Text split per letter for animation** must expose the whole word to assistive tech (`aria-label` on the wrapper, letters `aria-hidden`).
- **Contrast:** text ≥ 4.5:1 (≥ 3:1 for large text). Check `mix-blend-mode` text over images manually in screenshots.
- **Reduced motion:** grep changed files for GSAP, Framer Motion, CSS animations and transitions. Every non-essential animation must be disabled or reduced under `prefers-reduced-motion: reduce`. No scroll-jacking (wheel/touch hijacking) without a keyboard and reduced-motion fallback.

## 6. Links

- Collect every `a[href]` on each page in scope. Internal links must return 200; there must be no `href="#"` placeholders or dead routes.
- External links with `target="_blank"` have `rel="noopener noreferrer"`. Mail links use `mailto:`.
- External URLs: verify with a HEAD request where possible; otherwise list them for manual review.

## 7. Images and fonts

- `next/image` used for content images; every responsive or `fill` image has a `sizes` prop; above-the-fold hero has `priority`. No deprecated `layout=` prop.
- Alt text is descriptive (no "image", "screenshot", "Section N"); decorative images use `alt=""`.
- List files in `public/` over 500 kB as candidates to compress or convert to AVIF/WebP.
- Fonts load via `next/font` (no render-blocking Google Fonts `<link>` or `@import`); no font licensing issues (e.g. no publicly served commercial OTFs).

## 8. SEO and metadata

Per route: unique `title` and `description` (no "WIP"); Open Graph title, description and image; canonical URL. Site-wide: `sitemap` and `robots` routes exist; valid favicon `type` values.

## 9. Design quality bar

Answer briefly from the screenshots, with one line of evidence each:
1. Is the hierarchy understandable within 3 seconds?
2. Does it look professionally designed?
3. Does it communicate design thinking?
4. Is every interaction necessary and intuitive?
5. Does it work on mobile?
6. Is it accessible?
7. Is it performant?
8. Is it distinctive without being gimmicky? (Check against the `frontend-design` skill's list of generic defaults.)

## Report

Keep it short. Lead with the verdict: **SHIP**, **SHIP WITH FIXES**, or **BLOCKED**. Then:

| Check | Result | Notes / fix (with `file:line`) |
|-------|--------|-------------------------------|

Blocking: build failure, console errors, horizontal scroll on mobile, critical or serious axe violations, unreachable interactive elements, broken internal links. Everything else is a warning.

Fix blocking issues in files already part of the current change. Report everything else for Jonathan to decide; don't widen the change without asking.
