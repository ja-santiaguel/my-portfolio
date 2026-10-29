---
name: revision-log
description: Keep Jonathan's portfolio revision log, a record of major milestones (intentions, decisions, outcomes, learnings) in improving his own portfolio. Use only when a major update starts or finishes, when Jonathan says "log this" or asks about the log, or when preparing entries or the portfolio's own case study for publishing. Do not use for routine tweaks or iteration rounds.
---

# Revision log

On architectural drawings, the revision table records every change to a drawing: rev number, date, and what changed. This log does the same for the portfolio. It has two jobs:

1. **Memory.** Keep an honest record of why the site is the way it is.
2. **Showcase.** Provide raw material for a public "Revisions" page and for the portfolio's own case study, which shows how Jonathan thinks when the client is himself.

Raw entries are private working notes. Publishing is a separate, curated step that Jonathan approves.

## Where entries live

- Entries: `content/revisions/RNN-short-slug.md`, numbered in order (`R00`, `R01`, …). Read the highest-numbered file to get the next number.
- Visuals: `content/revisions/assets/RNN/`, named `{before|after}-{page}-{width}[-full].png` at widths 1440 and 375 (R00 is all baseline, so it drops the prefix). These are raw working captures, kept out of `public/` so they don't ship with the site.
- **Major updates only.** One revision = a milestone with a single intent (e.g. "home page rebuild", "case study system", "type system"), usually spanning many sessions. Iteration rounds, tweaks and fixes do not get their own entry.
- **Fold, don't append.** While a revision is open, update its sections in place (a bullet in What changed, a line in Learned) only when something meaningfully changes direction. Skip it for routine adjustments. Close the revision when the milestone ships.
- **Keep it lean.** About 3–6 screenshots per revision (final state, plus before), not one per iteration. Entries stay readable in under a minute.

## Entry format

```markdown
---
rev: R03
title: Replace the scroll-jacked carousel with a work index   # what changed, in plain words
date: 2026-10-12            # date opened; add `closed:` when done
type: iteration             # intention | addition | improvement | iteration | learning
status: in-progress         # planned | in-progress | done | dropped
publish: draft              # draft | approved | published (only Jonathan sets approved)
areas: [home, navigation]
---

## Intent
What I set out to do and why, written before the work starts. Keep this even if the plan changes.

## What changed
2–4 bullets. Link before/after visuals.

## Why
The reasoning: which goal it serves (quality, UX clarity, visual design, performance, accessibility, maintainability, SEO), and what was rejected and why.

## Evidence
Numbers or observations: Lighthouse/axe scores, bundle size, page weight, screenshots, feedback. Before → after.

## Learned
1–3 specific, falsifiable lessons. "Hover-only previews hid the work on touch devices", not "UX matters".

## Next
Open questions or follow-ups, if any.
```

Leave out sections that would be empty. An entry should take under a minute to read.

## Rules

- **Never invent.** Evidence comes from actual measurements, screenshots, or what Jonathan said. Missing data becomes `[TODO: …]`.
- **Log intentions before the work.** When a planned change starts, open the entry with `status: planned` or `in-progress` and fill in Intent first. A gap between intent and outcome is the most interesting part, so keep the original intent as written.
- **Capture "before" first** when a new major revision starts: screenshot the affected page at 1440 and 375 into `content/revisions/assets/RNN/`. You can't recreate a "before" afterwards.
- **Jonathan's voice, Jonathan's decisions.** Write in the first person as Jonathan. Record the decisions he made, and decisions still waiting on him as open questions, never as settled. Claude drafts; Jonathan edits and approves.
- **Credit honestly.** Keep an accurate private record of the work split (Jonathan's direction and decisions vs. AI-assisted implementation). How it's described publicly is Jonathan's call.
- **Follow the `case-study-writer` voice rules:** plain words, active voice, no filler.
- **Dropped is fine.** A `dropped` entry with a clear reason shows judgment. Don't delete it.

## Publishing (only when Jonathan asks)

1. Only entries with `publish: approved` appear on the public page.
2. Copy only the visuals that approved entries use from `content/revisions/assets/RNN/` to `public/revisions/RNN/`, converted to WebP/AVIF and resized to display size. Never publish the raw folder.
3. The public page is a revision table (rev, date, one-line change) where each row expands to the entry, with before/after visuals.
4. Pull the strongest 3–5 entries into the portfolio's own case study (`/work/portfolio`) using the `case-study-writer` structure.
5. After publishing, set `publish: published`.
6. Run `ship-check` on the revisions page.
