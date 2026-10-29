---
name: motion
description: Motion rules for Jonathan's portfolio. Use whenever creating, editing, tuning or reviewing anything that moves - transitions, animations, hover/press feedback, load-in or entrance effects, exits, layout switches (list <-> grid), scroll effects, page transitions, cursor motion, or JS-driven animation timing.
---

# Motion

> Also read `DESIGN.md` (repo root) first: its taste log records which motion Jonathan liked and which glitches Jonathan disliked.

The site's motion follows Apple's model: physically based, quick to respond, calm to settle, never decorative for its own sake. Motion explains a change (what appeared, what moved, where it went). If it doesn't explain anything, cut it.

## The system

Tokens live in `src/styles/globals.css`, with a JS mirror in `src/lib/motion.js`. Use them for all new timed motion; never introduce a new curve or an ad-hoc duration.

| Token | Value | Use for |
|---|---|---|
| `--ease-smooth` / `springSmooth` | Critically damped spring (SwiftUI `.smooth` model) as CSS `linear()` | Everything that moves or appears |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Things leaving or fading out |
| `--dur-micro` / `DURATION.micro` | 200 ms | Hover, press, cursor changes, toggles |
| `--dur-short` / `DURATION.short` | 350 ms | Small UI changes: labels, fades, small reveals |
| `--dur-medium` / `DURATION.medium` | 500 ms | Layout moves: list ↔ grid morph, outline glide |
| `--dur-long` / `DURATION.long` | 800 ms | Large entrances: hero expand, settle-snap |
| `--ease-move` / `EASE_MOVE` + `--dur-move` / `DURATION.move` | `cubic-bezier(.76, 0, .24, 1)`, 900 ms | Big moves between two resting places (the list ↔ grid rearrange, 2026-10-20): a strong ease-in-out, run only after the text has left (leave → move → enter) |
| `--ease-reveal` / `EASE_REVEAL` + `--dur-reveal` / `DURATION.reveal` | `cubic-bezier(.16, 1, .3, 1)`, 1100 ms | Content coming into view: text lines, screens, section rules (2026-10-19, measured from mikewilcockdesign.com/work/fun-arena). Expo out: most of the move in the first quarter, then a long soft settle. Animate transform and opacity (text may add a slight blur; never blur large images) |

Duration sets the character: short = crisp, long = calm. Pick by distance and importance, not by taste in the moment.

## Rules

1. **Restraint on entering and exiting.** Whenever something enters or leaves view (load-in, list ↔ grid, reveals, overlays):
   - Animate the **one or two things that explain the change**, not everything. The layout switch moves the media; it does not also stagger, fade and scale every label.
   - **No cascades** of independent entrance animations. A single stagger across a related group (letters of a title, lines of a paragraph) is fine; stagger ≤ 50 ms per item and the whole group done within about 1 s.
   - Prefer **opacity + a short translate or clip**. No scale-bounces, rotations, skews or wobbles.
   - Exits are **shorter** than entrances (`--dur-micro`/`--dur-short` with `--ease-exit`).
2. **One signature moment per view.** The page can have one memorable motion (the hero flight, the split-flap title). Everything around it stays quiet.
3. **Interruptible and state-driven.** Entrances are **trigger-based** (2026-10-19, replacing scroll-driven entrances from 2026-10-13, which ran too fast when people scrolled fast): mark the element `data-trigger` (and `data-media` for screens) and let `ViewTrigger.js` set `[data-in]`, then play a fixed-length CSS animation keyed on `[data-in]`, hidden only under `html[data-trigger-ready]`; leaving through the bottom it gets `[data-out]`, so give it an exit (the entrance reversed, `--dur-short`, `--ease-exit`) whose keyframes name their `from` values (an implicit start is the hidden base style, so it would vanish at once). Exits keep the page's order (2026-10-27): whatever sits lower in the same `<section>` leaves with an element above it, so a lower line never outstays a higher one. At rest, nothing on screen stays hidden (2026-10-23): once scrolling settles, ViewTrigger plays any trigger that is on screen but never crossed its entry line (a locked section can leave its last lines in the bottom band). Don't write new per-component IntersectionObservers for entrances. Keep scroll-driven motion for things that *are* the scroll (the footer column cover, the 3D laptop sequence, parallax, home clip reveals). Motion state is calculated from triggers, scroll position, time or the current layout, never piled up; fast or reversed input must never leave anything half-finished.
4. **Respond within 100 ms.** Hover and press feedback starts immediately (`--dur-micro`).
5. **Reduced motion always.** Under `prefers-reduced-motion: reduce`: no continuous motion, no parallax, no montage cycling; layout switches are instant; entrances become simple appearances. The global rule in `globals.css` shortens CSS motion; JS motion must check the media query itself.
6. **Ambient motion is rare.** Anything that moves on its own (montage cycling, title flips) runs slowly, only while in view, and stops under reduced motion. At most one ambient element in view at rest.
7. **Hover only on hover devices.** Hover styles go inside `@media (hover: hover)`; keyboard focus gets the same feedback via `:focus-visible`.

## Deliberate exceptions (tuned by feel; don't "normalise" them)

- **Scroll-linked effects:** the opening clip mask on media, the parallax drift, and the pinned photographic showcase (`PhotoShowcase`: depth push-in and the screen scrolling, 2026-10-19). They map to scroll, not time.
- **The noth.in lag:** the critically damped follow on the hero portrait's flight (`FOLLOW` in `HeroStage.js`) and on the parallax (`useMediaParallax.js`).
- **Split-flap mechanics:** flip durations and the gravity curves in `SplitFlapWord`.
- **The opening montage's cut pacing:** accelerating cuts by design.
- **Aether’s context ink fill is scroll-tracked** (Jonathan, 2026-10-19): `InkText mode="scroll"`, a deliberate exception to trigger-based entrances, for a fact read as you scroll.
- **Page transitions and layout switches hold entrances**: ViewTrigger queues entrances while `html[data-page-transition]` or `html[data-layout-switching]` (list ↔ grid) is set and plays them when it clears; anything that animates on load must also hold under the page-transition attribute.
- **The list ↔ grid landing stagger** (2026-10-20): 60 ms per photo in project order, over the 50 ms rule, so the sequential landing Jonathan asked for reads; the off-screen part of each path is compressed to 30% (`FAR` in `layoutTransition.js`).
- **The display-letter overshoot** (`--ease-rise` / `springRise`, 2026-10-18): title letters rise on an underdamped spring (~4% overshoot, soft settle), after mikewilcockdesign.com's wordmark, with the blur and opacity clearing early. Display letters only since 2026-10-19 (lines and screens moved to `--ease-reveal`); everything else keeps the critically damped spring.

## Page transitions

Built (`PageTransition.js`, see DESIGN.md); back/forward play the full cover too (2026-10-21, held with `NavigationGate`). Direction (2026-10-12, reference https://www.akaru.fr/, see DESIGN.md): **one consistent, branded transition for every route change**, including the browser's back and forward buttons, that covers loading so pages never cut or pop in. The earlier idea (the clicked project image grows into the case study) may become part of it. Constraints: built from the existing tokens, short and interruptible, never holding a fast visitor longer than loading needs, instant under reduced motion, focus moved to the new page's main heading.

## Checklist before calling motion done

- Uses the tokens (no new curves or durations), or is a listed exception.
- Passes the restraint rule: count the things moving on enter or exit. More than two unrelated things means cut.
- Reduced motion tested (Playwright `reducedMotion: "reduce"`).
- No layout shift or horizontal overflow mid-animation; nothing left half-finished after rapid input.
- Verified in a real browser at 1440 and 375 with real wheel or touch input.
