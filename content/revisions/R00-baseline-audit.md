---
rev: R00
title: Audit the inherited portfolio before changing anything
date: 2026-09-28
closed: 2026-10-05
type: learning
status: done
publish: draft
areas: [architecture, design system, accessibility, performance, content]
---

## Intent
Understand what I already had (what works, what doesn't, what's worth keeping) before redesigning. Refine, don't throw away.

## Findings
- **Worth keeping:** the monochrome palette, big condensed Oswald type, clip-path wipes, blend-mode titles, the DIGITAL ↔ VISUAL swap, and the Aether story ("15 hours a week → 30 days a year").
- **Broken:**
  - No mobile layout at all: at 375px the hero is cut off and the Aether text collides with its title.
  - The home page hijacked the scroll wheel to show one project at a time, which couldn't be skimmed or used with a keyboard.
  - `/contact` returned a 500 error (its page file was empty).
  - It read as unfinished: "(WIP)" in the title and a "coming soon" slide.
- **Under the hood:** three animation libraries, render-blocking fonts, unlabelled icon links, clickable `div`s, and commercial Helvetica Neue fonts served publicly.

Before screenshots: `assets/R00/` (home slides at 1440 and 375, Aether at 1440 and 375).

## Learned
- The identity was never the problem; usability, mobile support and finish were.
- Only one of four projects is UX work, even though UX/UI is the role I'm aiming for.
