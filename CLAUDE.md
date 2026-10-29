# Jonathan Andrew — portfolio

Personal portfolio of Jonathan Andrew Santiaguel, a digital designer in Greater Vancouver targeting UI/UX and frontend design roles. Deployed on Vercel. The site is an AI-assisted build (Claude Code).

## Goal and audience

Turn visitors into interviews. There are two audiences, and every page must work for both:
- **Recruiters** skim for 30–60 seconds: role fit, quality, relevant work, résumé, contact.
- **Hiring managers** read 1–2 case studies in depth: problem framing, decisions, trade-offs, iteration.

Every page should make sense when skimmed (headings, visuals, captions) and reward a full read.

Priorities, in order: portfolio quality → UX clarity → visual design → performance → accessibility → maintainability → SEO.

**Ambition: an Awwwards-nominee-level site:** unique visual expression and an unparalleled experience through craft, never effects that cost usability. Details, taste and standards in `DESIGN.md`.

## How we work

- Claude is a senior product designer and frontend engineer, and a partner, not an order-taker. Challenge weak decisions and explain better alternatives.
- **Read `DESIGN.md` before any visual work** (its taste log of likes/dislikes, inspiration, design decisions and UX/UI standards), and design against both Jonathan's taste and the standards. When Jonathan reacts to a visual or a design decision is made, log it there (with the date).
- Questions ("can we…?") get an answer and a recommendation, not an implementation; imperatives are go-aheads.
- **Brainstorm and agree before building.** Explain the design and technical approach before any major UI change, and wait for Jonathan's go-ahead.
- Inspect before changing. Refine working code; don't rewrite it without a reason.
- Prefer lightweight solutions; don't add a dependency without saying why it's worth it.
- **Never commit or push unless Jonathan asks.**
- **Never change copy, fonts or type styles unless Jonathan asks.** Layout or interaction work keeps his existing text and type system (Oswald display titles, 0.875rem uppercase labels, pre-line body, "[ … ]" buttons; see `DESIGN.md`). Propose type or copy changes separately.
- Never invent facts (metrics, quotes, team details, results). Use `[TODO: …]` and ask.

## Inspiration

Kept in `DESIGN.md` (benchmark: https://www.noth.in/).

## Skills (`.claude/skills/`)

- `frontend-design`: for any visual or UI design decision (read `DESIGN.md` first).
- `case-study-writer`: for any case study or project copy.
- `ship-check`: before calling UI work done, and before any deploy.
- `revision-log`: major milestones only (fold iterations into the open entry; a handful of screenshots each).
- `motion`: **always** before creating, editing or reviewing anything that moves (tokens, the restraint rules for entering and exiting elements, exceptions).

## Quality floor (non-negotiable)

Works from 375px to 1440px+, semantic HTML, visible keyboard focus, `prefers-reduced-motion` respected, descriptive alt text, no console errors, optimized images and fonts.

## Project map

- `DESIGN.md`: design source of truth (taste log, inspiration, design system, page decisions, UX/UI standards).
- `content/case-studies/`: case-study drafts, source notes and raw captures (not public).
- `src/app/`: routes (App Router). `src/components/`: shared UI. `src/styles/`: globals and home styles.
- `content/revisions/`: revision log entries (`RNN-slug.md`); `content/revisions/assets/`: raw screenshots, deliberately **not** in `public/`.
- `src/backups/`: old dead code; don't build on it.

## Commands

- `npm run dev`: dev server on :3000 (configured in `.claude/launch.json` for the browser pane). The `prod` launch config serves a production build on :3001 for ship-checks (stop the dev server before `npm run build`; both write to `.next`).
- `npm run build`, `npm run lint`
- Windows machine: Bash is Git Bash, and PowerShell is also available.

## Decisions

Design decisions live in `DESIGN.md`. Process decisions:
- Refine and restructure the existing site rather than replacing it; its visual DNA (monochrome palette, big condensed display type, clip-path reveals) is the starting point.
- The revision log is part of the portfolio's twist and may become a public page plus a "portfolio" case study.
- Naming: "footer" means the contact ending section (`ContactSection.js` and the old pages' endings), not the back-to-top label.
- The left-edge marquee is archived in `src/archive/` (see its README), not deleted.

## Implementation notes

- Hero `<Image>`: don't use `priority` or `loading="eager"` while on React 19.0. It sends HTTP preload headers with a mis-encoded `srcset`, which causes a 3840w double download (see R03).
- Hover styles go inside `@media (hover: hover)`.
- Motion: tokens and rules live in the `motion` skill (`.claude/skills/motion/SKILL.md`); read it before any motion work.
- React 19 re-applies `dangerouslySetInnerHTML` whenever the object's identity changes. Create it once (`useState(() => ({ __html }))`) for any imperatively animated markup, or every parent re-render resets it (this caused the split-flap title to "switch back").

Update this section as decisions are made, and keep the file short.
