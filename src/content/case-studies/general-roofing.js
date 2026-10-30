// General Roofing case study. Copy drafted with Jonathan from
// content/case-studies/general-roofing.md; facts come from him, the live site
// and the old site's archive. Keep the two in sync.
//
// Callout rects are [x, y, w, h] in % of the screenshot: the area the focus
// effect closes in on when its note is hovered, focused or tapped.
//
// Structure (the "55-second" case study): what a reviewer needs in under a
// minute is visible, kept concise: context, decisions, process, lessons, and
// the finished product last. (Results live in "In short".)

const img = (name, width, height, alt) => ({
  src: `/images/projects/general-roofing/${name}.webp`,
  width,
  height,
  alt,
});

export const generalRoofing = {
  slug: "general-roofing",
  name: "General Roofing",
  lead: "A new website for a Lower Mainland roofing company, designed to turn visitors into quote requests.",
  outcome: "Client project, launched July 2026",
  spec: [
    { label: "Role", items: ["UX/UI design", "Copywriting", "Build in Figma Sites"] },
    { label: "Team", items: ["Solo", "Partner as client liaison"] },
    { label: "Timeline", items: ["~2 weeks of design and build"] },
    { label: "Tools", items: ["Figma", "Figma Sites"] },
  ],
  live: {
    href: "https://generalroofing.ca/",
    label: "[ View live site ]",
  },
  // The photographic showcase under the header (PhotoShowcase, 2026-10-19,
  // replacing the 3D laptop): the thematic laptop scene (content/mockups/
  // gr2-laptop) with the real homepage scrolling on its screen. Corners are
  // the green screen's, as composite-mockup.cjs measured them.
  scene: {
    label: "A laptop on a pale concrete block in window light on a rainy day, showing the new General Roofing homepage scrolling from the hero and quote form through services, reviews and the process.",
    image: img("scene-laptop", 3840, 2560, "The new General Roofing homepage on a laptop on a pale concrete block, window and raindrop shadows across the wall"),
    depth: "/images/projects/general-roofing/scene-laptop-depth.png",
    screen: { src: "/images/projects/general-roofing/screen-home.webp", width: 2880, height: 10280, levels: [1920, 1280, 960, 640] },
    corners: [[2193, 757], [3384, 735], [3251, 1660], [2048, 1567]],
    focus: [2720, 1180],
  },
  cover: img("cover-concrete", 2048, 3072, "General Roofing’s homepage on a laptop on a low concrete step in the corner of two plaster walls, a shaft of rainy window light across them"),

  // Three lines for the skim: the whole story before any scrolling.
  summary: [
    { label: "Problem", text: "A roofer with 30+ years of credentials had a dated site that showed almost none of them." },
    { label: "What I did", text: "Designed, wrote and built a four-page site in Figma Sites, solo, in about two weeks." },
    // Client feedback (2026-10-28, Jonathan): very satisfied with the
    // direction, the communication and the result. Paraphrased, not a quote;
    // worded differently from Highland's on purpose.
    { label: "Result", text: "Live since July 2026, the layout approved as first designed. The client was very happy with the finished site, and with how clearly the project was communicated from start to finish." },
  ],

  context: {
    title: "Context",
    facts: [
      { label: "Client", text: "General Roofing, a Lower Mainland roofer with 30+ years of experience." },
      { label: "Goal", text: "More quote requests from a site as established as the company. The client asked for credibility first, ahead of visual flair." },
      { label: "Constraint", text: "One revision round each for design and development, with the layout locked once the build began." },
    ],
    // Cropped to the first screen (no empty band below).
    before: img("compare-before", 2880, 1460, "The old General Roofing homepage: a roof photo, a headline and a floating estimate form"),
    after: img("compare-after", 2880, 1460, "The new homepage: aerial video, headline, trust badges and a four-field quote form"),
    frame: "Homepage — desktop",
    caption: "Drag to compare. Before, the credentials sat below the fold; after, proof sits directly under the headline.",
  },

  // Three decisions that changed what the site does for a homeowner (2026-10-18;
  // every feature verified on the live site), each cross-referenced to the
  // client's brief (content/case-studies/general-roofing.md): `ask` quotes it
  // word for word, or null when the decision went beyond it. All three answer
  // explicit asks (the fourth, Jonathan's own call, was removed). Each screen is a 2x capture of
  // one region, shown in columns 2-5 with its notes beside it.
  // Decision 1's reasoning approved by Jonathan 2026-10-28; the other two
  // keep his approved copy. "Two kinds of visitor, two paths" removed the same
  // day (Jonathan: "no need for decision 3").
  decisions: {
    title: "Key decisions",
    items: [
      {
        title: "One action, on every screen",
        ask: "Better messaging to drive quote requests",
        why: "The goal was more quote requests, so everything leads to one action: a quote button in the header of every page, and the form itself in the hero. On phones it becomes a single button, so the headline still fits the first screen.",
        tradeoff: "Less room for imagery above the fold; the aerial video runs behind the headline instead.",
        frame: "Homepage, first screen — desktop",
        image: img("decision-quote", 2880, 1680, "The homepage's first screen: the navigation with a Request a FREE Quote button, the headline, trust badges and a four-field quote form"),
        callouts: [
          { rect: [80.6, 2.3, 12.7, 4.1], text: "The quote button in the header of every page" },
          { rect: [63.4, 31.9, 27.8, 4.9], text: "A promise to reply within 24 hours" },
          { rect: [63.4, 37.6, 27.8, 27.2], text: "Four fields: only what a first quote needs" },
        ],
      },
      {
        title: "Proof before promises",
        ask: "A more professional, high-trust look; feature the GAF certification and Home Depot endorsement",
        why: "Trust decides who gets the call, so the proof sits directly under the headline, ahead of any services copy.",
        frame: "Homepage hero — desktop",
        image: img("decision-trust-2", 1638, 902, "Headline with Home Depot, GAF Certified and 5.0 Google rating badges beneath it"),
        callouts: [
          { rect: [4.9, 77.4, 25.6, 13.7], text: "Home Depot partnership, never mentioned on the old site" },
          { rect: [34.4, 77.4, 23.3, 13.7], text: "GAF certification, previously only a logo mid-page" },
          { rect: [61.7, 79.2, 18.9, 10.2], text: "The Google rating" },
        ],
      },
      {
        title: "Lower the anxiety of a big purchase",
        ask: "An “Our Process” section",
        why: "A new roof is expensive and disruptive, so a five-step process answers “what happens next?” before anyone has to ask, and financing is framed as monthly payments.",
        tradeoff: "A longer homepage, so each step is kept to one sentence.",
        frame: "Homepage process — desktop",
        image: img("decision-process-2", 1440, 1920, "Five-step process: consultation, roof and attic inspection, detailed plan, installation, final walkthrough"),
        callouts: [
          { rect: [4, 2.5, 92, 15], text: "It starts with a conversation, not a sale" },
          { rect: [4, 22.5, 92, 15], text: "Inspection before any pricing" },
          { rect: [4, 82.5, 92, 15], text: "A walkthrough with photos and warranty at the end" },
        ],
      },
    ],
  },

  process: {
    title: "Process",
    steps: [
      // The sketch and wireframe were reconstructed from the finished homepage
      // (2026-10-15) until the originals are found; the page marks them.
      // One composition for every step (desktop left, phone right), so the
      // stage reads as one design gaining fidelity.
      { title: "Sketches", text: "Page structure and hierarchy on paper.", image: img("process-1-sketch", 2400, 1500, "Pencil sketch of the homepage's first screen on desktop and phone, with notes: aerial video behind the headline, proof under the headline, the quote form in the hero, and one button on phones") },
      { title: "Wireframes", text: "Homepage and service layouts, low fidelity.", image: img("process-2-wireframe", 2400, 1500, "Greyscale wireframes of the homepage on desktop and phone: navigation, hero with trust badges, the four-field quote form, and the single quote button on phones") },
      { title: "High fidelity", text: "The design system and every page, approved as first designed.", image: img("process-3-hifi", 2400, 1500, "High-fidelity homepage designs on desktop and phone: aerial hero, headline, trust badges and quote form") },
      { title: "Build", text: "Built and published in Figma Sites, responsive to phones.", scale: 1.1, image: img("process-4-build-v3", 2400, 1500, "The built homepage on a laptop and a phone") },
    ],
  },

  // The finished product in mockups (rendered from the live site's screens
  // over its own aerial footage), not an embedded scroll frame.
  // The finished product as real screens (Devices.js), not baked mockups.
  showcase: {
    title: "Showcase",
    items: [
      {
        layout: "pages",
        screens: [
          img("screen-d-services", 2880, 1800, "The services page on desktop: tabs and the layered roofing system explainer"),
          img("screen-d-about", 2880, 1800, "The about page on desktop"),
          img("screen-d-contact", 2880, 1800, "The contact page on desktop"),
        ],
      },
      {
        layout: "phones",
        phones: [
          { image: img("screen-m-services", 1170, 2532, "The services page on a phone"), statusBg: "#ffffff", tone: "dark" },
          { image: img("screen-m-home", 1170, 2532, "The homepage hero on a phone, with the quote form as a single button"), statusBg: "#ffffff", tone: "dark" },
          { image: img("screen-m-process", 1170, 2532, "The five-step process on a phone"), statusBg: "#ffffff", tone: "dark" },
        ],
      },
    ],
  },

  lessons: {
    title: "What I learned",
    // What happened, then what I'd do next time (from the long-form draft in
    // content/case-studies/general-roofing.md).
    items: [
      {
        title: "Collect content before design",
        happened: "Both revision rounds went to copy and photos the client supplied mid-project.",
        next: "I'd gather the client's photos, facts and credentials before high fidelity, so revisions refine the design instead of catching up on content.",
      },
      {
        title: "Hear the client first-hand",
        happened: "Feedback reached me through my partner, and detail was lost on the way.",
        next: "I'd join the kickoff call to hear priorities in the client's own words and ask follow-up questions on the spot.",
      },
      {
        title: "Check the tool before scoping",
        happened: "The brief's interactive map of completed projects became a Google Maps embed.",
        next: "I'd confirm what the build tool supports before features go into the proposal.",
      },
    ],
  },
};
