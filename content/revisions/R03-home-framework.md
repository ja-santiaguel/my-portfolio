---
rev: R03
title: Rebuild the home page around free scrolling, one bold transition, and an easy-to-scan project list
date: 2026-10-05
closed: 2026-10-28
type: iteration
status: done
publish: draft
areas: [home, navigation, motion, layout, typography]
---

## Intent
The old home locked visitors into a scroll-jacked carousel of stacked, clip-masked slides. Scrolling fast or out of order broke it. I wanted free, smooth scrolling that still keeps one project in focus, a landing page that says who I am at a glance, a grid view for scanning, and motion with real craft, benchmarked against noth.in.

Before: `assets/R00/`.

## What changed (current state)
- **Opening:** on every full load of the home page, a small square montage cuts through all the project media. It starts slow and accelerates (16 cuts, 280 → 45 ms), hard-cuts to my portrait, then expands into the centre card. The nav, footer and marquee wait for it. Any input skips it, and it never plays with reduced motion. (`after-montage-1440`)
- **Landing:**
  - The title words flip letter by letter (DIGITAL ↔ VISUAL, DESIGNER ↔ ENTHUSIAST), cycling through all four pairings. Both sit behind a portrait cropped around me.
  - The left side has my name and a one-line statement of what I offer. The right side has Greater Vancouver and Portfolio ’26.
  - The page heading stays "Jonathan Andrew, Digital Designer" for screen readers and search engines. (`after-hero-1440`, `after-hero-375`)
- **Transition into the work:** the portrait frame scrolls with the page. Aether's first image wipes up inside it, and the frame's move and resize into the Aether panel trail the scroll with a noth.in-measured lag (a critically damped follow, no bounce). It then hands over to the real panel with no visible jump. (`after-transition-1440`)
- **Project list:**
  - Text runs title → project type → details → action, vertically centred. Titles are Oswald 600 outside the hero; the action buttons are bold.
  - Media opens with a scroll-tied clip mask and drifts noth.in-style inside its frame.
  - Gentle snapping glides to the nearest project only after a second of stillness.
  - A side index shows the current project. (`after-project-list-1440`)
- **List ↔ grid toggle:** uses View Transitions, so the media glides between layouts. (`after-grid-1440`)
- **Under the hood:**
  - Content lives in `src/content/projects.js`.
  - Smooth scroll via Locomotive/Lenis, as on the case study pages.
  - Every motion state is calculated from scroll position or time, never piled up from triggered animations.
  - No horizontal overflow; keyboard focus handled; reduced motion respected throughout.

## Key decisions along the way
- **Abandoned:** a WebGL "tissue" pull. The bouncy physics fought the "one deliberate gesture" feel I wanted.
- **Abandoned:** a full-screen montage. A square sidesteps every asset's aspect ratio.
- **Kept the lag, removed the hang:** the portrait no longer pins in place while the page scrolls away.
- **Reverted:** a noth.in-style corner wipe, in favour of my earlier scroll-tied clip mask. I kept the noth.in drift.

## Evidence
- **Landing hand-off:** within 0 px of the Aether panel at 1440 and 375, with matching parallax offsets.
- **Montage:** cut durations measured at 282 → 51 ms. The flip cycles all four title pairings.
- **Snapping:** never fires during continuous scrolling; it settles exactly on a project after input stops.
- **Errors and overflow:** zero console errors and zero horizontal overflow across test runs.

## Learned
- Fast, out-of-order scrolling broke the old site because state accumulated through triggered animations. Calculating state from scroll position or time fixes that class of bug.
- Matching an effect means measuring it. noth.in's "delay" is a specific curve, and its parallax moves the image up (faster than the page), not slower.
- In CSS, a hidden parent doesn't hide a child set to `visibility: visible`, and `overflow: hidden` breaks scroll-tied animations (`overflow: clip` doesn't).

## Next
Closed 2026-10-28. The production build, the `/contact` removal and Sha Tea (archived) moved into R04; the marquee stays archived. Lighthouse waits for the deploy.
