// Shared access to the page's smooth scroller (Locomotive Scroll / Lenis),
// with a native fallback when none is running (or motion is reduced).
import { springSmooth } from "./motion";

let scroller = null;

export const setScroller = (instance) => {
  scroller = instance;
};

export const getLenis = () => scroller?.lenisInstance ?? null;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Where the page scrolls to for an element. Elements are measured against the
// page's real scroll position: after a layout change (list -> grid) the
// browser may have clamped it, and Lenis's remembered position would be stale.
// [data-land="center"] (2026-10-27, Jonathan: Services' title fell under the
// navbar) lands the element centred in the space below the fixed navbar, or,
// when it's taller than that space, starts it a gap below the navbar.
export function landingTop(el) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  if (el.dataset.land !== "center") return top;
  const navbar = document.querySelector("header[data-chrome]")?.offsetHeight ?? 0;
  const space = window.innerHeight - navbar;
  const gap = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
  return top - navbar - Math.max(gap, (space - el.offsetHeight) / 2);
}

export function scrollToTarget(target, { immediate = false, duration = 1, easing = springSmooth } = {}) {
  const instant = immediate || prefersReducedMotion();
  if (typeof target !== "number") target = landingTop(target);
  const lenis = getLenis();
  if (lenis) {
    // Layout may have just changed (e.g. list <-> grid); refresh limits first.
    if (instant) lenis.resize();
    lenis.scrollTo(target, { immediate: instant, duration, easing, force: true });
    return;
  }
  window.scrollTo({ top: target, behavior: instant ? "instant" : "smooth" });
}
