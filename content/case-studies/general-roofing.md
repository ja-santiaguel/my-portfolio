# General Roofing — case study draft (v3, for review)

Status: built at /projects/general-roofing in the 55-second structure (2026-10-12). Live copy is in src/content/case-studies/general-roofing.js; this file keeps the long-form draft and the client-quote draft.
Sources: the client brief (via partner), the live site (generalroofing.ca, captured 2026-10-09), the old Webflow site (Wayback Machine snapshot from 2026-06-14, rebuilt with its original styles from Webflow's CDN), Jonathan's answers.
Raw captures (working files, not for the public folder): `content/case-studies/general-roofing/` (`before-*` and `after-*`).
Word budget: ~800 words (UX case study structure, shortened: no formal research phase was run).

---

## 1. Hero + summary (≤40 words)

**General Roofing**
A new website for a Lower Mainland roofing company, designed to turn visitors into quote requests.

| Role | Team | Timeline | Tools | Outcome |
|---|---|---|---|---|
| UX/UI design and build | Solo (a partner handled client communication) | ~2 weeks of design and build, published July 2026 | Figma, Figma Sites | Live at generalroofing.ca |

Visual: `after-desktop-hero.png` in a desktop frame.
Alt: "General Roofing homepage: aerial photo of a roof, headline, trust badges and a free-quote form."

---

## 2. Problem (≤80 words)

People choose a roofer on trust, and General Roofing had earned it: 30+ years of experience, GAF certification, a Home Depot partnership. Its old Webflow site showed almost none of it. The certification appeared only as a logo halfway down the page, the Home Depot partnership wasn't mentioned at all, there was a single testimonial, and services stopped at three. The site looked less established than the company behind it.

Visual: before/after homepage pair (`before-desktop-full.png` / `after-desktop-full.png`), cropped to the first two screens.
Caption: "Before: credentials buried below the fold. After: proof sits directly under the headline."

---

## 3. Context and constraints (≤60 words)

- **Client brief** (via my partner, who handled client communication): a more professional, high-trust look; feature the GAF certification and Home Depot endorsement; updated services and testimonials; the crew and family story; an "Our Process" section; a map of completed projects; better messaging to drive quote requests.
- **One revision round in design and one in development, with no layout changes in development.**

---

## 4. My role (≤60 words)

I designed, wrote and built the whole site on my own in Figma Sites: information architecture, copy, imagery selection (alongside a few client-supplied photos), page layouts, the design system, responsive layouts and the build, across four pages (Home, Services, About, Contact). My partner ran client communication and passed on feedback.

---

## 5. Key design decisions (≤250 words) — the core

> Each one is a real feature of the live site. The "why" is drafted for you: **check it matches your thinking**, since you'll be asked about it.

**1. The quote form lives in the hero.**
The goal was more quote requests, so asking for one takes zero clicks. Four required fields, with reassurance beside them ("We'll get back to you within 24 hours", "Your info is private"). The old site also had a hero form, but it floated half off the image with a free-text message box; the new one is shorter and anchored.
Trade-off: less room for imagery above the fold, so the aerial video sits behind the headline instead.

**2. Proof before promises.**
Trust decides who gets the call. The Home Depot partnership, GAF certification and 5.0 Google rating sit directly under the headline, ahead of any services copy, with three reviews further down (the old site had one).

**3. Services organised the way customers think.**
People arrive with a property type or a problem, not a product name. Services split into Residential, Commercial & Strata, and Repairs (the old site had no commercial offering listed), and the Services page adds tabs plus a layered "how a roof works" explainer, so owners understand what they're paying for.

**4. Lower the anxiety of a big purchase.**
A new roof is expensive and disruptive. A five-step process (consultation to final walkthrough), a "What to expect" list on the Contact page and a financing section framed as monthly payments answer "what happens next?" and "can I afford it?" before anyone has to ask.

**5. A faster path for urgent jobs.**
Not every visitor is planning a roof. Someone with an active leak needs a person, not a form, so the phone number sits in the header on every page and a 24/7 emergency banner appears on Services and Contact. The form serves planned projects; the phone serves emergencies.

Visuals: one annotated screen per decision (hero form; trust bar; services tabs; process + financing; header phone + emergency banner).

---

## 6. Process and iterations (≤150 words)

Sketches → wireframes → hi-fi → build in Figma Sites.

- [PLACEHOLDER: early sketches]
- [PLACEHOLDER: wireframes — homepage structure]
- The client approved the layout as first designed. Both revision rounds changed only copy and client-supplied assets (photos, logos); no layout changes were requested. `[Optional: one before/after of a revision, e.g. a stock image replaced by the client's own project photo.]`

Caption example: "Wireframe: the trust badges moved from mid-page to directly under the headline."

---

## 7. Final solution (≤80 words)

Four pages, responsive from mobile to desktop, with the completed-projects map built as an embedded Google Map.

Visuals: a homepage scroll video (desktop, from the live site) + 3 mobile screens (hero with form, services, process) from `after-mobile-full.png`.

---

## 8. Results (≤80 words)

Published in July 2026 and live at generalroofing.ca. The layout was approved as first designed; revisions were limited to copy and client assets. The client was very satisfied with the direction, the communication and the result (Jonathan, 2026-10-28). On the site, paraphrased: "The client was very happy with the finished site, and with how clearly the project was communicated from start to finish." The "Two kinds of visitor, two paths" decision is off the site (Jonathan, 2026-10-28).

Client feedback — **DRAFT for the client to approve. Do not publish until they've signed off:**

> "We've had the same credentials for years, but the new site finally shows them. It looks as professional as the work we do, and customers tell us it's easy to find what they need and ask for a quote."
> — `[Name, title]`, General Roofing

How to use it: send it to the client (through your partner) as "Would you be happy for me to quote you on my portfolio? Edit anything you like." Once they approve or rewrite it, it's genuine.

---

## 9. What I learned (≤100 words)

> Drafted for you; keep only what rings true.

**Collect content before design.** Both revision rounds went to copy and assets the client supplied mid-project. Next time I'd gather the client's photos and facts before hi-fi, so revisions improve the design instead of catching up on content.

**Hear the client first-hand.** Feedback reached me through my partner. Joining the kickoff call would let me hear priorities in the client's own words and ask follow-up questions on the spot.

**Check the tool before scoping.** The brief's interactive project map became a Google Maps embed. Next time I'd confirm what Figma Sites supports before features go into the proposal.

---

## 10. Next (≤15 words)

Next project → `[TBD by the final project order]`

---

## Open items

- The brief says "50-year GAF"; the live site says "GAF Certified Contractor (top 2–5%)" and "30+ years". The draft uses the live site's wording.
- Still open: confirm the decision reasoning (section 5); client sign-off on the testimonial (section 8).
