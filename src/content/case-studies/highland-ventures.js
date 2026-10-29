// Highland Ventures Group: a showcase (not a full case study). Facts from
// Jonathan (2026-10-17) and the live site; the brief came through his partner.
// Jonathan wrote the live site's copy (from the client's draft). Page copy
// approved by Jonathan 2026-10-17.

const img = (name, width, height, alt) => ({
  src: `/images/projects/highland-ventures/${name}.webp`,
  width,
  height,
  alt,
});

export const highlandVentures = {
  slug: "highland-ventures",
  name: "Highland Ventures",
  lead: "A small, modern website for a new venture capital group, built to establish its presence and give founders a way to get in touch.",
  outcome: "Client project, launched October 2025",
  spec: [
    { label: "Role", items: ["UI design", "Copywriting", "Build in Webflow"] },
    { label: "Team", items: ["Solo", "Partner as client liaison"] },
    { label: "Timeline", items: ["~3 weeks of design and build"] },
    { label: "Tools", items: ["Figma", "Webflow"] },
  ],
  live: {
    href: "https://www.highland.ventures/",
    label: "[ View live site ]",
  },
  // Full width under the header (PhotoShowcase, 2026-10-19): the thematic
  // laptop scene (content/mockups/hv2-laptop: stone, a dark wall and
  // vertical-blind light, muted to the portfolio's greys) with the live
  // homepage scrolling on its screen (captured from highland.ventures).
  scene: {
    label: "A black laptop on a pale stone slab in striped window light, showing the Highland Ventures homepage scrolling from the hero through its principles to the footer.",
    image: img("scene-laptop", 3840, 2560, "The Highland Ventures homepage on a black laptop on a pale stone slab, striped window light across a dark wall"),
    depth: "/images/projects/highland-ventures/scene-laptop-depth.png",
    screen: { src: "/images/projects/highland-ventures/screen-home.webp", width: 2880, height: 4676, levels: [1920, 1280, 960, 640] },
    corners: [[925, 666], [2091, 610], [2215, 1425], [1032, 1571]],
    focus: [1566, 1068],
    drift: [0.47, 0.5],
  },
  cover: img("cover-stone", 2048, 3072, "The Highland Ventures homepage on a black laptop on the corner of a pale stone table, striped window light across it"),

  summary: [
    { label: "Brief", text: "A new venture capital group needed a small, modern site to start its presence and give founders a way to reach out." },
    { label: "What I did", text: "Designed the site in Figma, then built and launched it in Webflow: four pages, solo, in about three weeks." },
    // Client feedback (2026-10-28, Jonathan): very satisfied with the
    // direction, the communication and the result. Paraphrased, not a quote.
    { label: "Result", text: "Live since October 2025, with a contact form where founders can share their idea. The team backed the direction from the start and was very pleased with both the process and the launched site." },
  ],

  showcase: {
    title: "Showcase",
    items: [
      {
        layout: "pages",
        screens: [
          img("screen-d-services", 2880, 1800, "The Our Approach page on desktop: three principles on photo cards"),
          img("screen-d-about", 2880, 1800, "The About page on desktop, with the founder"),
          img("screen-d-contact", 2880, 1800, "The Contact page on desktop: the idea form"),
        ],
      },
      {
        layout: "phones",
        phones: [
          { image: img("screen-m-services", 1170, 2532, "The About page on a phone"), statusBg: "#ffffff", tone: "dark" },
          // The site's header is translucent over the hero photo, so its colour
          // varies across the width; the status bar continues it (sampled from
          // the capture's top edge) instead of a flat colour, which left a seam
          // along the header's top (2026-10-22).
          { image: img("screen-m-home", 1170, 2532, "The homepage hero on a phone"), statusBg: "linear-gradient(90deg, #2c2f2b 0%, #32352f 8.3%, #3b3c35 16.7%, #41423b 25%, #45463f 33.3%, #43443d 41.7%, #363833 50%, #282b28 58.3%, #2b2e29 66.7%, #353631 75%, #373932 83.3%, #393b35 91.7%, #3b3c37 100%)", tone: "light" },
          { image: img("screen-m-process", 1170, 2532, "Our Approach on a phone"), statusBg: "#ffffff", tone: "dark" },
        ],
      },
    ],
  },
};
