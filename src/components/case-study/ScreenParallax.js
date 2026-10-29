"use client";

import { useMediaParallax } from "../home/useMediaParallax";

// Mounts the site's depth parallax on this page: every [data-parallax] frame
// drifts its [data-parallax-image] slower than the page (screens use a
// gentler range, set on the frame).
export default function ScreenParallax() {
  useMediaParallax([]);
  return null;
}
