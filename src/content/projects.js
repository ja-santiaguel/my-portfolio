// Single source of truth for the home page's work sequence and grid.
// Copy is Jonathan's original home-page copy, kept verbatim. Change it only
// when he asks.

export const profile = {
  name: "Jonathan Andrew",
  fullName: "Jonathan Andrew Santiaguel", // hero byline
  email: "santiaguel.ja@gmail.com",
  // The résumé PDF (content/resume/, copied here when reprinted), opened in a new tab.
  resume: "/jonathan-santiaguel-resume.pdf",
  linkedin: "https://www.linkedin.com/in/jonathan-andrew-santiaguel/",
  instagram: "https://www.instagram.com/jasantiaguel/",
  // Landing page: job title as the two big words (both sit behind the
  // portrait), a one-line statement, name, location and edition.
  // Each word flips between its two options, bottom word first, so the title
  // cycles frontend developer / frontend designer / visual designer / visual
  // developer (2026-10-12).
  heroWords: [
    ["Frontend", "Visual"],
    ["Developer", "Designer"],
  ],
  heroTitle: "Frontend Developer", // stable accessible title
  // The statement (2026-10-27, Jonathan), set like the byline opposite: one
  // line per line break, longest first and shortening like the byline's
  // name, location and edition, so the two sides mirror across the portrait.
  statement: "I design and develop ideas into cohesive\nidentities, intuitive interfaces,\nand visual experiences.",
  location: "Greater Vancouver",
  edition: "Portfolio ’26",
  portrait: {
    src: "/images/portrait_01.png",
    width: 3024,
    height: 4032,
    alt: "Portrait of Jonathan Andrew",
    // Subject focus (normalised image coords) and how tightly the landing
    // view crops around it (1 = plain cover). Eyes land near the upper third.
    focus: { x: 0.5, y: 0.66 },
    heroZoom: 1.5,
  },
};

export const projects = [
  {
    slug: "aether",
    category: "mobile",
    title: "AETHER",
    secondTitle: "",
    description: [
      { header: "Project Type:", body: "Mobile Application helping caregivers simplify\ntheir form-filling processes." },
      { header: "Involvement (Team):", body: "- Research & Ideation\n- Wireframing & Prototyping\n- UX/UI Design & Development" },
      { header: "Tools Used:", body: "- Figma\n- Visual Studio Code\n- React / Next.js Framework" },
      { header: "Timeline:", body: "Sep—Dec 2024" },
    ],
    href: "/projects/aether",
    button: "[ View case study ]",
    media: [
      { src: "/images/projects/aether/cover-phone.webp", width: 2628, height: 4238, alt: "Aether home screen on a phone resting on a white stone", fit: "cover" },
      { src: "/images/mockups/aether/mobile_mockup_aether_01.jpg", width: 1950, height: 1300, alt: "Mockup of Aether Mobile App Home Screen", fit: "contain" },
      { src: "/images/mockups/aether/mobile_mockup_aether_02.jpg", width: 1950, height: 1300, alt: "Mockup of Aether Mobile App Library Screen", fit: "contain" },
      { src: "/images/mockups/aether/mobile_mockup_aether_03.jpg", width: 3900, height: 2600, alt: "Mockup of Aether Mobile App Form Screen", fit: "contain" },
    ],
  },
  {
    // Drafted with Jonathan for the General Roofing case study.
    slug: "general-roofing",
    category: "website",
    title: "GENERAL",
    secondTitle: "ROOFING",
    description: [
      { header: "Project Type:", body: "Website redesign for a Lower Mainland roofing company,\nbuilt to turn visitors into quote requests." },
      { header: "Involvement (Solo):", body: "- UX/UI Design & Copywriting\n- Development in Figma Sites" },
      { header: "Tools Used:", body: "- Figma\n- Figma Sites" },
      { header: "Timeline:", body: "—Jul 2026" },
    ],
    href: "/projects/general-roofing",
    button: "[ View case study ]",
    media: [
      { src: "/images/projects/general-roofing/cover-concrete.webp", width: 2048, height: 3072, alt: "General Roofing’s homepage on a laptop on a low concrete step in the corner of two plaster walls, a shaft of rainy window light across them", fit: "cover",
        // The laptop body (its base, a little left of the screen) held at the frame centre, in the tall list frame and the wide grid cell (2026-10-20: the body centred, the screen may sit slightly right).
        list: { focus: [0.51, 0.568], zoom: 1.15 },
        grid: { focus: [0.51, 0.582], zoom: 1.2 } },
    ],
  },
  {
    // A showcase (2026-10-17): designed in Figma, built in Webflow.
    slug: "highland-ventures",
    category: "website",
    title: "HIGHLAND",
    secondTitle: "VENTURES",
    description: [
      { header: "Project Type:", body: "Website for a new venture capital group, built to\nestablish its presence and invite founders in." },
      { header: "Involvement (Solo):", body: "- UI Design & Copywriting\n- Development in Webflow" },
      { header: "Tools Used:", body: "- Figma\n- Webflow" },
      { header: "Timeline:", body: "—Oct 2025" },
    ],
    href: "/projects/highland-ventures",
    button: "[ View showcase ]",
    media: [
      { src: "/images/projects/highland-ventures/cover-stone.webp", width: 2048, height: 3072, alt: "The Highland Ventures homepage on a black laptop on the corner of a pale stone table, striped window light across it", fit: "cover",
        // The laptop sits high and right in the photo: its centre (measured)
        // held at the frame's centre in the list and the grid (2026-10-20; re-measured for the 2026-10-21 photo).
        position: "57% 50%", parallax: [-8, 0],
        // The landing frame centres the laptop's body (its base), not its screen, a little zoomed out (2026-10-22).
        list: { focus: [0.51, 0.388], zoom: 1.07 },
        // Grid cells are wide: the laptop's centre (measured on the photo) held at the cell's centre (2026-10-20).
        grid: { focus: [0.467, 0.401], zoom: 1.2 } },
    ],
  },
  {
    slug: "arasaka",
    category: "creative",
    title: "ARASAKA",
    secondTitle: "ESTATE",
    description: [
      { header: "Project Type:", body: "Magazine Cover for an architectural showcase of\nthe ARASAKA Estate within Cyberpunk 2077." },
      { header: "Involvement (Solo):", body: "- Art Direction & Concept\n- Graphical Editing" },
      { header: "Tools Used:", body: "- Adobe Photoshop 2024\n- Adobe Illustrator 2024\n- Adobe InDesign 2024" },
      { header: "Timeline:", body: "—Oct 2024" },
    ],
    href: "/projects/arasaka",
    button: "[ View showcase ]",
    media: [
      { src: "/images/projects/arasaka/cover-magazines.webp", width: 2400, height: 3696, alt: "Mockup Magazine Cover of the embodiment of ARASAKA ESTATE", fit: "cover" },
      { src: "/images/mockups/arasaka/magazine_mockup_02.png", width: 9536, height: 3750, alt: "Mockup Magazine Cover of the embodiment of ARASAKA ESTATE, spread", fit: "contain" },
    ],
  },
];

// Cursor label shown over clickable showcase images.
export const mediaCursorLabel = "[ View ]";

// Availability, shown at the top of Services (2026-10-26). Keep it current:
// `status` sets the indicator's colour ("available" green, "limited" amber,
// "unavailable" grey); `label` is the line beside it.
// Kept current by hand. status: "available", "limited" or "unavailable".
export const availability = {
  status: "available",
  label: "Available for work",
};

// Services (2026-10-26, regrouped by discipline the same day, Jonathan: the
// websites and mobile lists barely differed; the names match the roles he's
// after). Each lists what it covers, one item per line, and the projects
// that show it. icon: "board" (UX/UI), "monitor" (development) or "creative".
export const services = [
  {
    icon: "board",
    name: "UX/UI design",
    // Rewritten 2026-10-28 (Jonathan: "better align with our goal"): the
    // research-led process in order, then the craft, then the platform.
    items: [
      "User research & testing",
      "User flows & information architecture",
      "Wireframing & prototyping",
      "Interface & interaction design",
      "Design systems",
      "UX writing",
      "Figma ecosystem",
    ],
    projects: ["aether", "general-roofing", "highland-ventures"],
  },
  {
    icon: "monitor",
    name: "Web development",
    // Widened 2026-10-28 (Jonathan: "im capable of more than those 3"):
    // the builds that serve the goal (sites that convert, load fast and work
    // for everyone), then the platforms.
    items: [
      "Responsive websites",
      "Landing pages built to convert",
      "Interaction & motion",
      "Accessibility & performance",
      "SEO & launch",
      "Webflow, Framer & Figma Sites",
      "React / Next.js",
    ],
    projects: ["general-roofing", "highland-ventures"],
  },
  {
    icon: "creative",
    name: "Creative",
    // Rewritten 2026-10-28; Poster design stays (Jonathan: "i still offer it
    // as a service").
    items: ["Art direction & concept", "Editorial design", "Poster design", "Photo editing & compositing"],
    projects: ["arasaka"],
  },
];

// The toolkit: the résumé's fuller skill set (2026-10-27). Built as a last
// Services row, then taken out the same day (Jonathan: it didn't flow
// there); shown on the About page's Toolkit rows.
export const toolkit = [
  { name: "Design", items: ["Figma", "Photoshop", "Illustrator", "InDesign"] },
  { name: "Front end", items: ["React / Next.js", "JavaScript", "HTML / CSS", "Tailwind CSS", "Webflow", "Framer", "Figma Sites"] },
  { name: "Back end", items: ["Supabase", "SQL", "Python", "GitHub"] },
  { name: "AI", items: ["Claude", "GPT"] },
];
