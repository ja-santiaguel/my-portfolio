// Parallax for case-study screens, using the home page's hook
// (useMediaParallax): a frame [data-parallax] whose child [data-parallax-image]
// drifts slower than the page.

// Recordings and step images: the media is 112% of its frame and moves
// -9% -> -2% of its height. Spread onto the frame; the moving child carries
// data-parallax-image.
export const SCREEN_PARALLAX = { "data-parallax": "", "data-parallax-from": "-9", "data-parallax-to": "-2" };

// Showcase mockups (whose whole image matters): the image
// is scaled up 6% (.parallaxScale) and drifts -2.5% -> 2.5% inside the frame,
// so it moves like the home media but nothing important is ever cropped, and
// overlays inside the moving layer stay aligned with the image.
export const SCREEN_PARALLAX_SUBTLE = {
  frame: { "data-parallax": "", "data-parallax-from": "-2.5", "data-parallax-to": "2.5" },
  layer: { "data-parallax-image": "" },
};

