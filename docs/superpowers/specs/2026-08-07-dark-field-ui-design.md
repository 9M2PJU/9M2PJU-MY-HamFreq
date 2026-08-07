# Dark Field UI Redesign

## Goal

Modernize MY-HamFreq into a polished, dark, field-ready frequency reference that works comfortably on desktop and mobile browsers without changing its data model or core functionality.

## Design direction

Keep the existing dark radio-console identity, but reduce decorative glow and improve hierarchy. Use deep navy-black surfaces, restrained emerald primary actions, cyan VHF/UHF accents, amber PMR accents, and JetBrains Mono for frequency values only. Prefer solid contrast and spacing over layered glass effects.

## Page structure

1. **Header** — retain the logo, guides, About, install, and donate actions. Tighten spacing and make the mobile treatment compact without causing overflow.
2. **Hero** — shorten the introduction and make the database/search purpose immediately clear. Keep sharing available but visually secondary.
3. **Stats** — retain total, simplex, repeater, and PMR counts. Reduce glow and emphasize readable numbers and labels.
4. **Database controls** — make search the primary control. Keep horizontal filter scrolling on narrow screens, and keep Near Me, view toggle, and CSV export as accessible touch targets.
5. **Results** — preserve dynamically rendered cards and table views. Improve frequency typography, metadata grouping, spacing, hover/focus states, and empty/loading feedback.
6. **Guides** — retain the existing four guide links, presenting them as a quieter resource section below the database.
7. **Footer and overlays** — preserve existing footer, donation modal, map modal, toast, and back-to-top behaviors while aligning their visual treatment with the refreshed system.

## Responsive behavior

- Mobile-first layout with no horizontal page overflow.
- Search becomes full width; filters remain horizontally scrollable with touch-friendly spacing.
- Utility actions use compact icon-first controls at small widths and reveal labels when space allows.
- Stats remain a two-column grid on phones and expand to four columns on wider screens.
- Result cards use a single-column layout on phones and multi-column layout on desktop.
- Tables remain available through an intentional horizontal scroll region rather than forcing the page wider.
- Sticky controls account for the fixed header and safe-area insets where supported.

## Accessibility and interaction

- Preserve semantic labels and keyboard-accessible buttons/links.
- Use visible focus states with sufficient contrast.
- Maintain readable text and frequency contrast against dark surfaces.
- Add `prefers-reduced-motion` coverage for entrance, hover, shimmer, and pulse effects.
- Keep touch targets around 44px where practical.

## Implementation boundaries

- Work within the existing static HTML, Tailwind input, generated CSS, and JavaScript architecture.
- Do not alter CSV data, filtering logic, map behavior, PWA registration, SEO prerendering, or content pages unless a small style hook is required.
- Prefer reusable CSS classes and small HTML class adjustments over inline-style growth.

## Verification

- Run the existing build command to regenerate SEO output and CSS.
- Inspect the rendered page at desktop and mobile viewport sizes.
- Verify search/filter/view controls remain usable, no horizontal overflow is introduced, and overlays still open/close.
- Confirm the final diff is limited to the redesign and generated artifacts expected from the build.
