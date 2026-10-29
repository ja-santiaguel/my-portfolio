# Archive

Components removed from the site but kept to bring back later. Nothing here is imported.

- `SlidingText/`: the vertical "DIGITAL DESIGNER // JONATHAN ANDREW Y.97 + barcode slogans" marquee that ran down the left edge. Removed 2026-10-05. To restore: move both files back to `src/components/` and render `<SlidingText />` in `src/app/layout.js` (above `<Header />`).
- `sha-tea/`: the unfinished Sha Tea case-study page (`/projects/sha-tea`), never linked from the work list. Archived 2026-10-28 (Jonathan: "archive it for now"). Its images stay in `public/images/mockups/sha-tea/`. To restore: move the folder back to `src/app/projects/sha-tea/` and add the project to `src/content/projects.js`.
- `reckless/`: the Reckless poster showcase (`/projects/reckless`). Archived 2026-10-28 (Jonathan: "archive Reckless"). `app/` was `src/app/projects/reckless/`, `content/reckless.js` was `src/content/case-studies/reckless.js`, and `project.js` holds its entry from `src/content/projects.js` (it was last in the work order and in the Creative service's projects). Its images stay in `public/images/mockups/reckless/`. To restore: move the three back and re-add the entry and the service link.
