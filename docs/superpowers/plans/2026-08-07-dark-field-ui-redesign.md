# Dark Field UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the MY-HamFreq interface into a professional dark, field-ready experience that is comfortable on desktop and mobile browsers.

**Architecture:** Keep the current static HTML, Tailwind build, inline page behaviors, and generated SEO/CSS outputs. Make the redesign through reusable CSS hooks and targeted HTML class adjustments; do not change CSV parsing, filtering, map, PWA, or content-page logic.

**Tech Stack:** Static HTML, Tailwind CSS 3, generated `assets/styles.css`, existing JavaScript in `index.html`, local CSV/PapaParse, Font Awesome.

## Global Constraints

- Keep the existing dark radio-console identity.
- Do not alter CSV data, filtering logic, map behavior, PWA registration, SEO prerendering, or content pages unless a small style hook is required.
- Mobile-first layout with no horizontal page overflow.
- Preserve semantic labels and keyboard-accessible buttons/links.
- Add `prefers-reduced-motion` coverage for entrance, hover, shimmer, and pulse effects.
- Keep touch targets around 44px where practical.
- Run the existing build command to regenerate SEO output and CSS.

### Task 1: Establish the refreshed visual system

**Files:**
- Modify: `index.html` — inline theme and component styles in `<head>`
- Modify: `assets/input.css` — source component tokens and responsive utilities

**Interfaces:**
- Produces reusable classes such as `.site-shell`, `.site-header`, `.hero-panel`, `.stat-card`, `.glass-panel`, `.glass-card`, `.control-button`, `.freq-box`, and `.table-scroll` for the page markup.

- [ ] **Step 1: Add shared color, surface, border, shadow, and radius tokens** to the existing style layer, keeping emerald/cyan/amber semantic accents and reducing opacity/glow intensity.
- [ ] **Step 2: Add responsive-safe base rules** for `box-sizing`, media overflow, `button`/input font inheritance, safe-area padding, and readable dark color contrast.
- [ ] **Step 3: Add reduced-motion rules** that disable shimmer, pulse, entrance transforms, hover lifts, and toast animation when `prefers-reduced-motion: reduce` is active.
- [ ] **Step 4: Run `npm run build:css`** and confirm Tailwind emits the new source classes without errors.
- [ ] **Step 5: Commit** with `git add index.html assets/input.css assets/styles.css && git commit -m "style: establish dark field visual system"`.

### Task 2: Refine the home page hierarchy and responsive controls

**Files:**
- Modify: `index.html` — header, hero, stats, controls, guides, footer class hooks and copy hierarchy

**Interfaces:**
- Consumes the reusable visual classes from Task 1.
- Preserves existing element IDs: `installBtn`, `donateOpenBtn`, `search`, `filters`, `geo-btn`, `viewToggle`, `resultsSummary`, and `output`.

- [ ] **Step 1: Update header markup classes** to use the compact site-header treatment, preserve all navigation links, and keep desktop labels/mobile icon-first presentation.
- [ ] **Step 2: Simplify hero hierarchy** so the database purpose and search action are visually dominant while the share row remains available as a secondary action.
- [ ] **Step 3: Restyle stat cards** with quieter backgrounds, consistent icon blocks, stronger numeric typography, and stable two-column mobile/four-column desktop layout.
- [ ] **Step 4: Restyle the sticky controls** so search occupies the full row on small screens, filter chips scroll within their own row, and utility buttons remain usable without page overflow.
- [ ] **Step 5: Add the `.table-scroll` hook** to the table-view wrapper if needed, ensuring only the table region scrolls horizontally.
- [ ] **Step 6: Refresh guide/footer hierarchy** with calmer card treatments and consistent action affordances without changing destinations.
- [ ] **Step 7: Run `npm run build`** and verify generated HTML/CSS update cleanly.
- [ ] **Step 8: Commit** with `git add index.html assets/input.css assets/styles.css && git commit -m "refactor: polish home page hierarchy and controls"`.

### Task 3: Verify desktop/mobile behavior and interaction safety

**Files:**
- Modify: `index.html` or `assets/input.css` only if verification identifies a concrete layout/accessibility defect.
- Inspect: `index.html`, `assets/styles.css`, existing inline JavaScript behavior.

**Interfaces:**
- Verifies existing search, filters, card/table toggle, Near Me, CSV export, modal, and PWA-related controls remain wired to their original IDs and handlers.

- [ ] **Step 1: Start a local static server** with `python -m http.server 4173` from the repository root.
- [ ] **Step 2: Capture desktop and mobile screenshots** at 1366×768 and 390×844 using the installed headless Chrome command.
- [ ] **Step 3: Inspect screenshots** for header overlap, clipped controls, unreadable frequency values, horizontal body overflow, and sticky-control collisions.
- [ ] **Step 4: Run a browser smoke check** for page load, search input, filter buttons, view toggle, CSV link, and modal open/close behavior using the rendered page and console output available in the environment.
- [ ] **Step 5: Apply only targeted fixes** for defects found, then rerun the build and screenshots.
- [ ] **Step 6: Check the final diff** with `git status --short` and `git diff --stat`; confirm no data files or unrelated pages changed.
- [ ] **Step 7: Commit** final verification fixes with `git add index.html assets/input.css assets/styles.css && git commit -m "test: verify responsive dark field UI"`.

## Verification commands

```bash
npm run build
python -m http.server 4173
git diff --check
git status --short
```

Expected result: build succeeds, `git diff --check` reports no whitespace errors, desktop/mobile layouts fit their viewports, and all existing database actions remain functional.
