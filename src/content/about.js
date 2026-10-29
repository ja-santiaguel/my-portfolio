// The About page (redesigned 2026-10-27, Jonathan: "you may adjust layout and
// copy to better fit our goal"). Recruiters skim the header (who, where,
// focus, availability, the resume); hiring managers read on (the path, why,
// background, toolkit). Beyond design removed 2026-10-28 (Jonathan).
//
// Sources, no new facts: Jonathan's original About copy (the path, why he
// designs, beyond design), the résumé (BCIT, KPU, Aether's team of 10, the
// tools), the case studies (client work) and DESIGN.md's story (architecture
// shapes the structure; the kitchen taught testing, adjusting, discipline).

export const about = {
  lead: "I’m Jonathan Andrew Santiaguel, a designer and frontend developer in Greater Vancouver. I design and build websites and apps that people connect with and act on, from research to launch.",

  // The header's title block (the availability row is added from projects.js).
  facts: [
    { label: "Based in", items: ["Greater Vancouver, BC"] },
    { label: "Focus", items: ["UX/UI design", "Frontend development"] },
    { label: "Studied", items: ["Digital Design & Development", "BCIT, 2023–2025"] },
  ],

  portrait: {
    src: "/images/portrait_02.png",
    width: 3024,
    height: 4032,
    alt: "Jonathan Andrew Santiaguel in a cream long-sleeve top and a fine chain, hands in his pockets, against a pale grey wall",
  },

  path: {
    title: "My path",
    lead: "An architecture student, turned junior sous chef, turned digital designer. Each step left something I still work by.",
    // A real sequence, so numbered ("[ n ]").
    steps: [
      {
        title: "Architecture",
        text: "Drawing sets taught me structure: grids, title blocks and details that line up from one sheet to the next. My layouts still work that way.",
      },
      {
        title: "The kitchen",
        text: "As a junior sous chef I learned to taste, adjust and go again, with discipline and under pressure. It’s how I test and iterate.",
      },
      {
        title: "Digital design",
        text: "I studied Digital Design & Development at BCIT, and now design and build websites and apps for clients, from research to launch.",
      },
    ],
  },

  why: {
    title: "Why I design",
    // Jonathan's own line, as two statements that fill with ink.
    statements: ["Good design shouldn’t just be seen.", "It should also be felt."],
    // Two paragraphs (2026-10-28, Jonathan): why (creativity and connection),
    // then how (research-led, flows and hierarchy, built to convert).
    text: [
      "Creativity and connection are why I design. Film, visual design and interactive experiences showed me how design can move people, so I aim for work with its own character, work people remember.",
      "Research is how I get there. I start with who it’s for and what they need to do, then shape the user flows, visual hierarchy and interface around it, so the path to requesting a quote or getting in touch is clear. Then I build it, test it and refine it until it’s as easy to use as it is to look at.",
    ],
  },

  // Newest first. Projects link to their pages (names and links from
  // projects.js).
  background: {
    title: "Background",
    items: [
      { when: "2026", project: "general-roofing", detail: "Website redesign, client project, solo" },
      { when: "2025", project: "highland-ventures", detail: "Website, client project, solo" },
      { when: "2024", project: "aether", detail: "Mobile app, BCIT, team of 10" },
      { when: "2023–2025", name: "Digital Design & Development", detail: "British Columbia Institute of Technology" },
      { when: "2016", name: "Drafting", detail: "Kwantlen Polytechnic University" },
    ],
  },

  // The practice first, then the tools (projects.js `toolkit`).
  toolkit: {
    title: "Toolkit",
    practice: { name: "UX/UI", items: ["User research & testing", "user flows & information architecture", "wireframing & prototyping", "interface & interaction design", "design systems", "UX writing"] },
  },
};
