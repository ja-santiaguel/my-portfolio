// AETHER: a team case study from Jonathan's BCIT program, on the General
// Roofing structure (2026-10-19): header, in short, context, key decisions,
// process, what I learned, showcase.
//
// Sources: the previous Aether page's copy (kept word for word where it's
// used whole) and the home page's project entry (timeline, tools, role).
// DRAFTS for Jonathan to confirm: the decisions' "Why" and notes, the
// context facts and the process step lines are condensed from that copy.
// Team size (10) from his résumé, 2026-10-27.

const shot = (name, width, height, alt) => ({ src: `/images/screenshots/${name}.jpg`, width, height, alt });
const img = (name, width, height, alt) => ({ src: `/images/projects/aether/${name}.webp`, width, height, alt });
// Whole app screens (status-bar area included): fit="screen" in the frame.
const phone = (name, width, height, alt, statusBg) => ({ image: shot(name, width, height, alt), statusBg, tone: "dark", fit: "screen" });

export const aether = {
  slug: "aether",
  name: "Aether",
  lead: "AETHER is a mobile application designed to ease the burden of form-filling for caregivers by streamlining complex documentation into an intuitive and efficient experience.",
  // Status from Jonathan (2026-10-19): built in his BCIT program, fully
  // built, never released publicly.
  outcome: "Academic project at BCIT, built but not released",
  spec: [
    { label: "Role", items: ["Research & Ideation", "Wireframing & Prototyping", "UX/UI Design & Development"] },
    { label: "Team", items: ["Team of 10"] },
    { label: "Timeline", items: ["Sep–Dec 2024"] },
    { label: "Tools", items: ["Figma", "Visual Studio Code", "React / Next.js"] },
  ],
  // Full width under the header (PhotoShowcase, 2026-10-19): the Aether
  // phone photo extended with ChatGPT (content/mockups/aether-extended: more
  // wall and sunlit floor, mostly to the right) so the phone sits left of
  // centre with room around it. It mirrors General Roofing and Highland
  // (laptop right of centre, screen facing left, the zoom into the right):
  // the phone's screen faces right, so it sits left (37% across) and the
  // zoom goes into the left, the phone drifting slightly towards the middle.
  scene: {
    label: "A phone leaning against a pale concrete wall in hard daylight, showing the Aether app's home screen, with the sunlit floor opening out to the right.",
    image: { src: "/images/projects/aether/scene-phone.webp", width: 3840, height: 2560, alt: "The Aether app's home screen on a phone leaning against a pale concrete wall, sunlight across the floor to its right" },
    depth: "/images/projects/aether/scene-phone-depth.png",
    focus: [1438, 1300],
    drift: [0.43, 0.5],
  },

  summary: [
    { label: "Problem", text: "Managing paperwork is an unavoidable yet often overlooked part of caregiving. Recognizing this, we set out to understand the impact of form-filling and how it affects the lives of caregivers." },
    { label: "Solution", text: "Built with compassion and accessibility in mind, AETHER leverages AI-powered assistance to simplify data entry, reducing stress for those managing critical paperwork." },
    { label: "Result", text: "Through research, testing, and iteration, AETHER evolved into an intuitive and efficient tool that empowers caregivers thanks to a team of hardworking individuals." },
  ],

  context: {
    title: "Context",
    // The problem in two numbers, set large and filled with ink.
    statements: [
      "Caregivers spend up to an average of 15 hours a week managing forms and paperwork.",
      "This equates to nearly 30 days a year spent away from things that matter most.",
    ],
    facts: [
      { label: "Who", text: "Family caregivers and healthcare aides, in personal and professional caregiving roles." },
      { label: "Goal", text: "Smooth and simple: caregivers complete forms efficiently, without unnecessary friction." },
      { label: "Research", text: "Interviews, user personas and journey maps of how caregivers handle documents in real scenarios." },
    ],
  },

  // One decision per research finding ([1] tiring, [2] overwhelming,
  // [3] confusing), each shown on the final design.
  decisions: {
    title: "Key decisions",
    items: [
      {
        title: "Fill a form once, then let it fill itself",
        askLabel: "Research finding",
        ask: "The repetitive nature of form-filling was tiring.",
        why: "Caregivers save a profile for themselves and each person in their care, and AETHER auto-fills forms from it.",
        tradeoffLabel: "What testing changed",
        tradeoff: "Some testers found auto-fill unclear and needed guidance on pre-saving information, so we added clearer instructions.",
        device: "phone",
        frame: "My Profiles — phone",
        image: shot("hifi_screenshot_4", 430, 931, "The My Profiles screen: a tip about storing care recipients' information for two-tap autofilling, and saved profiles for the caregiver, a care recipient and a grandfather"),
        callouts: [
          { text: "A tip on why profiles help: two-tap autofilling", rect: [3, 28, 93, 10] },
          { text: "One profile for each person in their care", rect: [3, 40, 94, 49] },
          { text: "Add a profile in one tap", rect: [79, 79, 17, 9] },
        ],
      },
      {
        title: "Plain words for complex jargon",
        askLabel: "Research finding",
        ask: "Understanding and remembering complex jargon was overwhelming.",
        why: "AI-driven guidance simplifies a form's jargon for clarity, and help with a form is the first thing the home screen offers.",
        device: "phone",
        frame: "Home — phone",
        image: shot("hifi_screenshot_1", 430, 931, "The home screen: a greeting, a card asking “Need help clarifying a form today?” with Search, Scan and Clarify, and recent forms"),
        callouts: [
          { text: "Help with a form, first on the home screen", rect: [3, 14, 94, 45] },
          { text: "Clarify: plain-language help with a form", rect: [65, 46, 29, 12] },
          { text: "Recent forms, ready to pick up", rect: [3, 61, 94, 25] },
        ],
      },
      {
        title: "Every form in one organized place",
        askLabel: "Research finding",
        ask: "Managing volumes of information was confusing.",
        why: "Document organization keeps forms, profiles and history together, with a more intuitive display of saved documents.",
        device: "phone",
        frame: "My Forms — phone",
        image: shot("hifi_screenshot_3", 1170, 2532, "The My Forms screen: search, tabs for forms, profiles and history, and saved forms with their status"),
        callouts: [
          { text: "Forms, profiles and history, one tab apart", rect: [4, 21, 92, 6] },
          { text: "Each form with its status: draft or complete", rect: [4, 40, 92, 31] },
          { text: "Search across saved forms", rect: [4, 14, 92, 6] },
        ],
      },
    ],
  },

  process: {
    title: "Process",
    steps: [
      { title: "Research", text: "Interviews with family caregivers and healthcare aides, turned into user personas.", scale: 1.1, image: img("process-1-research", 2400, 1500, "A user persona: Clarisse Adams, a remote office manager caring for her elderly mother, with her motivations and frustrations") },
      { title: "Ideation", text: "Caregiver journeys mapped to find friction points and essential tasks.", scale: 1.1, image: img("process-2-journey", 2400, 1500, "The user journey map: the steps of finding, filling and saving a form") },
      { title: "Wireframes", text: "Load in, select a form, and complete it with ease.", image: img("process-3-wireframes", 2400, 1500, "Three low-fidelity screens on phones: home, saved profiles and form filling") },
      { title: "Refinement", text: "Testing led to clearer guidance and a more modern, functional look.", image: img("process-4-refinement", 2400, 1500, "Mid-fidelity screens beside the high-fidelity library and saved forms") },
    ],
  },

  lessons: {
    title: "What I learned",
    items: [
      {
        title: "Clarity is key to an efficient experience",
        paragraphs: [
          "Users need guidance. Early testing revealed confusion around our major features, leading us to improve onboarding and the inclusion of contextual tool-tips.",
          "By prioritizing clarity, we ensured a easier learning curve for first-time and repeat users.",
        ],
      },
      {
        title: "User-Centered Design is Essential",
        paragraphs: [
          "Every design decision was driven by real user needs. Continuous testing and iteration helped refine AETHER’s features, ensuring that the app not only functioned efficiently but also provided a stress-free experience tailored to caregivers.",
          "By actively listening to user feedback, we were able to create an intuitive solution that seamlessly integrated into their daily routines.",
        ],
      },
      {
        title: "Collaboration drives impact",
        paragraphs: [
          "AETHER’s success was built on teamwork, problem-solving, and a shared vision. Each phase of development—research, design, and iteration—was strengthened by open communication and adaptability.",
          "The result was a meaningful solution that truly addressed caregivers' challenges.",
        ],
      },
    ],
  },

  // Flat screens on the ink band, like General Roofing and Highland Ventures
  // (2026-10-19): thematic photos are for the previews, not the showcase.
  showcase: {
    title: "Showcase",
    items: [
      {
        layout: "phones",
        phones: [
          phone("hifi_screenshot_2", 1170, 2532, "The form library on a phone", "#f2f1f6"),
          phone("hifi_screenshot_1", 430, 931, "The home screen on a phone", "#f3f2f8"),
          phone("hifi_screenshot_4", 430, 931, "Saved profiles on a phone", "#f2f1f6"),
        ],
      },
      {
        layout: "phones",
        phones: [
          phone("hifi_screenshot_3", 1170, 2532, "My Forms on a phone: saved forms with their status", "#f2f1f6"),
          phone("hifi_screenshot_5", 430, 931, "A form's details on a phone, ready to start", "#bfc0c4"),
        ],
      },
    ],
  },
};
