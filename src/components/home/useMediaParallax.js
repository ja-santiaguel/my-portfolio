"use client";

import { useLayoutEffect } from "react";
import { SCROLL_TIMELINES } from "../ScrollTimelineFallback";

// Media parallax: the image is taller than its frame (130%) and drifts down
// inside it as the frame crosses the viewport (-19% -> -4% of the image's
// height), so the image moves slower than the page (classic depth parallax).
// It trails the scroll with a soft follow (time constant ~0.35 s, as on
// noth.in). The frame's opening clip mask is CSS (Slide.module.css), with a
// fallback here where scroll timelines aren't supported.
//
// Frames: [data-parallax] containing one [data-parallax-image]. A frame can
// set its own range with data-parallax-from / data-parallax-to (in % of the
// image's height), e.g. a gentler drift for screenshots.
const FROM = -19;
const TO = -4;
const FOLLOW = 3; // per second

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// The opening clip mask for browsers without scroll-driven animations
// (Firefox, 2026-10-29): the same keyframes and range as Slide.module.css's
// frameOpen (inset(14% 5% 0 5%) -> 0 over entry 0%-80%), on frames marked
// [data-parallax-reveal]. Tied to the scroll like the CSS, never lagged; the
// same sum as listClip in layoutTransition.js.

const revealFor = (r, vh) => {
  const k = 1 - clamp01((vh - r.top) / (0.8 * r.height));
  return `inset(${(14 * k).toFixed(2)}% ${(5 * k).toFixed(2)}% 0 ${(5 * k).toFixed(2)}%)`;
};

export function useMediaParallax(deps) {
  // A layout effect, placing every picture synchronously when the items
  // mount (2026-10-20): the list <-> grid view transition captures the new
  // layout right after it renders, before any frame could run.
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const items = [...document.querySelectorAll("[data-parallax]")]
      .map((frame) => ({
        frame,
        image: frame.querySelector("[data-parallax-image]"),
        from: Number(frame.dataset.parallaxFrom ?? FROM),
        to: Number(frame.dataset.parallaxTo ?? TO),
        reveal: !SCROLL_TIMELINES && !reduce && frame.hasAttribute("data-parallax-reveal"),
        current: null,
      }))
      .filter((item) => item.image);

    let frameId = 0;
    let last = 0;

    const targetFor = (item) => {
      const r = item.frame.getBoundingClientRect();
      const vh = window.innerHeight;
      if (item.reveal) item.frame.style.clipPath = revealFor(r, vh);
      const progress = clamp01((vh - r.top) / (vh + r.height));
      return { value: item.from + (item.to - item.from) * progress, near: r.bottom > -vh && r.top < vh * 2 };
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      let moving = false;
      for (const item of items) {
        const { value, near } = targetFor(item);
        // Snapped while the work switches layout (2026-10-20): a lagged
        // follow would slide the picture inside its frame mid-flight.
        if (item.current === null || reduce || !near || document.documentElement.hasAttribute("data-layout-switching")) item.current = value;
        else item.current += (value - item.current) * (1 - Math.exp(-FOLLOW * dt));
        if (Math.abs(value - item.current) > 0.02) moving = true;
        else item.current = value;
        item.image.style.transform = `translate3d(0, ${item.current.toFixed(3)}%, 0)`;
      }
      frameId = moving ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (frameId) return;
      last = performance.now();
      frameId = requestAnimationFrame(tick);
    };

    // Place them now, at their scroll positions, then follow. "parallax:place"
    // re-places them at once (the layout switch fires it right after its
    // scroll jump, before the new layout is captured).
    const place = () =>
      items.forEach((item) => {
        item.current = targetFor(item).value;
        item.image.style.transform = `translate3d(0, ${item.current.toFixed(3)}%, 0)`;
      });
    place();
    wake();
    window.addEventListener("parallax:place", place);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("parallax:place", place);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
