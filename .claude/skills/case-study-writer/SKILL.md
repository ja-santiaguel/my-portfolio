---
name: case-study-writer
description: Structure, write, and edit portfolio case studies and project pages for Jonathan Andrew's portfolio. Use when drafting or revising any case study or project copy (Aether, Arasaka, Reckless, Sha Tea, or new projects), planning a case study's sections and visuals, or auditing an existing case study for gaps.
---

# Case study writer

A case study exists to get a hiring manager to say "this person thinks clearly and ships good work" in under two minutes. Most readers skim: headings, the first sentence of each section, images, and captions. Write for that skim first, depth second.

## Ground rules

- **Never invent facts.** Metrics, participant counts, quotes, team size, outcomes, and dates come from Jonathan. If a fact is missing, write `[TODO: ask — how many caregivers were interviewed?]` and list it in your reply. A fabricated metric in a portfolio is worse than none.
- **"I" vs "we" is information.** On team projects, say plainly what Jonathan personally did ("I ran 4 of the 6 interviews and built the form flow in React") and what the team did. Recruiters look for this first.
- **Show, then tell.** Every section has a visual (screenshot, diagram, before/after, video, artifact). Text explains what the visual can't.
- **Decisions over activities.** "We did wireframes" is an activity. "I moved auto-fill to the first screen because 3 of 5 testers missed it in the menu" is a decision with evidence.

## Structure: UX / product case study

Word budgets are ceilings, not targets. Aim for 700–1,100 words total.

| # | Section | Content | Max words | Visual |
|---|---------|---------|-----------|--------|
| 1 | Hero + summary | Project name, one-line description of what it is and who it's for. Summary bar: role, team, timeline, tools, outcome. | 40 | Hero image of the final product |
| 2 | Problem | One hook (a specific number or a real moment), then 2–3 sentences on who hurts and why it matters. | 80 | Optional stat or a quote |
| 3 | Context & constraints | Brief, client/course, timeline, tech or business constraints. | 60 | — |
| 4 | My role | Concrete responsibilities, with "I" for Jonathan's work. | 60 | — |
| 5 | Research | Method + who + how many → the 2–3 findings that shaped the design. | 120 | Persona, journey map, affinity map |
| 6 | Design decisions | 2–4 decisions, each one: **decision → why → evidence → trade-off**. This is the core of the case study. | 250 | Annotated screens per decision |
| 7 | Iterations | Before/after pairs: what testing revealed and what changed. | 150 | Side-by-side lo/mid/hi-fi |
| 8 | Final solution | The shipped/final design in use. Prefer a prototype video or interactive embed over static mockups. | 80 | Video, prototype, mockups |
| 9 | Results / impact | Measured outcomes, test results, feedback, grade/award, or what was shipped. If nothing was measured, say what you would measure. | 80 | Numbers, quotes |
| 10 | What I learned | 2–3 specific lessons Jonathan would act on next time. Not platitudes. | 100 | — |
| 11 | Next | Link to the next project and a contact CTA. | 15 | Next-project preview |

## Structure: visual / graphic work (Arasaka, Reckless, Sha Tea)

These are shorter showcase pages, around 150–300 words total: brief → concept (the one idea behind it) → 1–3 key craft decisions (type, composition, colour, technique) → final artifact, shown big → tools/timeline. Let the work dominate the page.

## Captions and alt text

- **Captions** tell the reader what to notice: "Mid-fi: saved profiles moved from a menu to the home screen after testing." Not "Mid-fidelity screens."
- **Alt text** describes the content and its purpose in ≤125 characters: "Aether home screen with three recent forms and an Auto-fill button." Never "image", "screenshot 1", "Section 1 Background". Decorative images get `alt=""`.

## Voice

- First person, active voice, plain verbs, sentence case for headings.
- Be specific: numbers, names of screens, real user behaviour.
- One idea per paragraph; paragraphs of 1–3 sentences.
- Banned filler (rewrite with something specific): seamless/seamlessly, intuitive (without evidence), user-centric, leverage, empower, delightful, meaningful, robust, "a testament to", "elevate", "journey" (unless it's a journey map), "passionate about".
- Lessons must be falsifiable. "Collaboration drives impact" says nothing. "Testing the auto-fill flow in week 3 instead of week 8 would have saved a full redesign" says something.

## Workflow

1. **Audit first.** For an existing case study, map its current content onto the structure table and list: missing sections, unsupported claims, banned filler, walls of text over 3 sentences, images without useful captions or alt text.
2. **Ask for missing facts.** Batch the TODO questions into one short list for Jonathan.
3. **Draft.** Write each section within budget. Pair every section with a specific visual: name the existing asset in `public/images/...` or describe the asset that needs to be made.
4. **Cut pass.** Remove ~20% of words. Remove any sentence that a reader skimming headings and captions wouldn't miss.
5. **Hand off to code.** Put content in the project's content data when it exists (planned: `src/content/projects.js` driving `/work/[slug]`). Until then, edit the page in `src/app/projects/<slug>/page.js`. Use the shared case study section components rather than one-off markup, and follow the `frontend-design` skill for visual treatment.
