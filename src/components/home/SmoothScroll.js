"use client";

import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { setScroller, getLenis } from "@/lib/scroll";
import { springSmooth, DURATION } from "@/lib/motion";

// When to settle: a short beat after the page comes to rest AND the input has
// stopped (a trackpad keeps sending tiny momentum events after the page looks
// still; settling under them would stutter). Measured from whichever ends
// last, so a mouse wheel and a trackpad feel the same. Long enough to read as "the visitor
// stopped", short enough that the glide still feels like the end of their own
// gesture rather than the page moving by itself.
const REST_SPEED = 0.5; // px per frame; slower than this counts as at rest
const REST_MS = 300;
// Glide length by distance: small corrections are quick, big ones calm.
const settleDuration = (distance) =>
  (distance < window.innerHeight * 0.25 ? DURATION.medium : DURATION.long) / 1000;

// Where to settle, judged at the scroll position the page is heading to.
// The region with the largest visible area there wins: [data-snap="start"]
// settles to its top (the list slides, and the grid view as one section);
// [data-snap="free"] would opt a region out of snapping.
function settleTarget(destination) {
  const vh = window.innerHeight;
  const shift = window.scrollY - destination;
  let best = null;
  let bestArea = 0;
  let bestTop = 0;
  document.querySelectorAll("[data-snap]").forEach((el) => {
    const r = el.getBoundingClientRect();
    const top = r.top + shift;
    const bottom = r.bottom + shift;
    const visible = Math.max(0, Math.min(bottom, vh) - Math.max(top, 0));
    if (visible > bestArea) {
      bestArea = visible;
      best = el;
      bestTop = top;
    }
  });
  if (!best || best.dataset.snap !== "start") return null;
  if (Math.abs(bestTop) < 2 || Math.abs(bestTop) > vh * 0.6) return null;
  return destination + bestTop;
}

// Smooth scrolling like the showcase pages, plus "settle snapping": visitors
// scroll freely past projects; only once their input pauses does the page
// glide to the project that should be in view (desktop only).
export default function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let pressed = false; // a held pointer (e.g. dragging the scrollbar) never gets pulled

    const settle = () => {
      const lenis = getLenis();
      if (!lenis || pressed || !desktop.matches || reduce.matches) return;
      // Never while the work switches layout (2026-10-20): the switch sets
      // its own scroll, and a glide would move the frames under it.
      if (document.documentElement.hasAttribute("data-layout-switching")) return;
      const destination = lenis.targetScroll ?? window.scrollY;
      const top = settleTarget(destination);
      if (top === null) return;
      lenis.scrollTo(top, { duration: settleDuration(Math.abs(top - window.scrollY)), easing: springSmooth });
    };

    // Restart the countdown; it only runs out once nothing has moved for REST_MS.
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(settle, REST_MS);
    };

    const instance = new LocomotiveScroll({
      // Every scroll (wheel, trackpad momentum, keys, scrollbar) re-arms while
      // it is still visibly moving; the slow tail of a glide doesn't count.
      scrollCallback: ({ velocity }) => {
        if (Math.abs(velocity) > REST_SPEED) arm();
      },
    });
    setScroller(instance);

    // Input itself (including momentum crumbs) also re-arms.
    window.addEventListener("wheel", arm, { passive: true });
    window.addEventListener("keydown", arm, { passive: true });

    const onDown = () => (pressed = true);
    const onUp = () => {
      pressed = false;
      arm();
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      setScroller(null);
      instance.destroy();
    };
  }, []);

  return null;
}
