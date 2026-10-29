---
rev: R04
title: Rebuild About, bring the résumé into the site, and get it ready to launch
date: 2026-10-26
type: improvement
status: in-progress
publish: draft
areas: [about, resume, hero, seo, accessibility, performance]
---

## Intent
With the home page and case studies in place, the rest of the site still read like a student portfolio: an old About page, a résumé that looked nothing like the site and wasn't linked from it, a vague hero statement and "(WIP)" in the page title. I wanted every page to work for a recruiter's 30-second skim, and the site ready to ship.

(Written at the end of the work, 2026-10-28; the intent was set across several requests from 2026-10-26.)

## What changed
- **About, rebuilt** in the case studies' language: a one-screen header (title, short intro, a facts table with live availability, "[ View resume ]") beside a full-height portrait that clip-opens on load, then My path, Why I design, Background (linked to the projects) and Toolkit. The copy now moves from why I design (creativity and connection) to how (research, flows, visual hierarchy, built to convert). (`after-about-1440.jpg`, `after-about-375.jpg`)
- **Résumé, rebuilt** in the site's type and layout, focused on UX/UI and frontend, with the two client sites and a title line. It's linked from the navbar, the menu, the footer and About, and opens in the browser rather than downloading. (`after-resume.png`)
- **Hero statement:** "I design and develop ideas into cohesive identities, intuitive interfaces, and visual experiences," set line by line to mirror the byline opposite. The old tagline is retired everywhere.
- **Archived** Sha Tea and Reckless (2026-10-28); the home grid now lays out four projects.
- **Trimmed the case studies:** no Showcase captions (the photos speak for themselves), General Roofing down to three key decisions, and each client result now says in its own words how satisfied the client was.
- **Web development services** widened from three items to seven, outcomes first (landing pages built to convert, interaction and motion, accessibility and performance, SEO and launch), then platforms.
- **Launch prep:** real page titles, canonical URLs, Open Graph previews with a shared image (`after-og-image.png`), a sitemap and robots file; Oswald self-hosted and three unused Google Fonts removed; touch targets brought to 44px; the empty `/contact` page and the legacy page styles removed.

## Why
Recruiters decide in under a minute, so the facts they look for (role, location, availability, résumé) now sit on the first screen of About, and the résumé is one click from anywhere. Hiring managers get the reasoning: the path, the method and the projects behind each claim. Launch prep was about not losing people at the door: a "(WIP)" title or a blank link preview undercuts everything behind it.

## Evidence
- **Build:** passes; First Load JS 131–139 kB per route (budget 150 kB).
- **Responsive:** no horizontal scroll at 375, 768 and 1440 on all seven routes (six after Reckless was archived).
- **Console:** zero errors across all routes.
- **axe:** no serious or critical issues beyond the difference-blended navbar and corner label (axe can't see blend modes; they render dark on concrete) and InkText words before they fill.
- **Touch targets:** "[ Menu ]" 38 → 44 px; Services project links 22 → 44 px rows.
- **Page transitions:** cover and reveal on every route, for clicks and for back/forward.
- **Page weight:** fonts 1.7 MB → 88 kB (Latin WOFF2 subsets of the four Helvetica Neue weights in use), which brings the first load of `/` from about 2 MB to under 1 MB. [TODO: Lighthouse scores once deployed]
- **Before:** [TODO: no capture of the old About page was taken before the rebuild]

## Learned
- A résumé built from the site's own type system reads as part of the portfolio; the old one read as a separate document.
- `mix-blend-mode` text fails automated contrast checks it actually passes, so it needs checking by eye in screenshots.
- A stacked list of links can look fine and still fail on touch: 22 px rows are too close to tap reliably.

## Next
- Fonts: the Helvetica Neue web licence.
- Reckless's landing cover is 450 kB at full size.
- Close this revision when the site is deployed.
