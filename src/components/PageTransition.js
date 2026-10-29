"use client";

import { use, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./PageTransition.module.css";
import TransitionLogo from "./TransitionLogo";
import { getLenis, landingTop } from "@/lib/scroll";

// Page transition (after auge-xp.com): eight ink blocks, one per grid column,
// slide up over the page one after another (left to right), the route
// changes underneath, then the blocks carry on up and off the top in the
// same order to reveal the new page. The logo sits in the middle, broken
// apart (TransitionLogo): it assembles as the blocks close and comes apart
// just before they open. The reveal waits until the logo has assembled. The new page's load-in animations are
// held while it's covered and play once the reveal ends.
//
// - Internal link clicks are intercepted (capture phase, before Next's Link)
//   so the cover can play first; the router navigates once it's covered.
// - Back/forward play the same cover (2026-10-21; they used to cover
//   instantly): the browser has already changed the URL, but Next renders
//   the new route in a React transition, so NavigationGate (around the
//   pages) suspends it until the blocks have closed, and React keeps the old
//   page on screen meanwhile. Hash-only history steps don't transition.
// - Skipped for same-page links (hashes, the current page), new tabs,
//   modifier-clicks, downloads, external links, and reduced motion.
// - The page can't be scrolled while a transition runs (wheel, touch and
//   scroll keys are blocked at the window, before any smooth scroller), and
//   every page it lands on starts at the top, or at its #section when the
//   link has one. The reset happens while the blocks cover the screen.
const SAFETY_MS = 4000; // reveal anyway if a navigation never lands
const BLOCKS = 8; // the site's grid columns
// The logo has assembled ~700 ms after a click; the reveal waits until
// ~1000 ms so the complete mark holds for a beat (~300 ms) before glitching out.
const ASSEMBLED_MS = 1000;
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

// Blocks scrolling input while the transition runs (capture phase on the
// window runs before Lenis or any page's own scroller).
const blockScroll = (e) => {
  if (e.type === "keydown" && !SCROLL_KEYS.has(e.key)) return;
  e.preventDefault();
  e.stopPropagation();
};
const lock = () => {
  ["wheel", "touchmove", "keydown"].forEach((t) => window.addEventListener(t, blockScroll, { capture: true, passive: false }));
  getLenis()?.stop();
};
const unlock = () => {
  ["wheel", "touchmove", "keydown"].forEach((t) => window.removeEventListener(t, blockScroll, { capture: true }));
  getLenis()?.start();
};

// The new page starts at the top, or at the #section the link points to.
const resetScroll = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  const el = id ? document.getElementById(id) : null;
  const top = el ? landingTop(el) : 0;
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(top, { immediate: true, force: true });
  }
  window.scrollTo({ top, left: 0, behavior: "instant" });
};

// While back/forward is covering, the promise the new page waits on.
let gate = null;

// Wraps the pages (in the root layout): holds a back/forward route change
// until the panel has covered the screen.
export function NavigationGate({ children }) {
  usePathname(); // re-render with every route change
  if (gate) use(gate);
  return children;
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef(null);
  const phase = useRef("idle"); // idle | covering | covered | revealing
  const safety = useRef(0);
  const assembledAt = useRef(0);
  const lastPath = useRef(null);

  const html = () => document.documentElement;

  const setState = (state) => {
    phase.current = state;
    panel.current.dataset.state = state;
  };

  const reveal = () => {
    clearTimeout(safety.current);
    // Not before the logo has assembled; then two frames so the new page has
    // painted under the panel.
    const wait = Math.max(0, assembledAt.current - performance.now());
    setTimeout(() => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setState("revealing");
        })
      );
    }, wait);
  };

  // Once the new route has rendered: start it at the top, then reveal.
  useEffect(() => {
    lastPath.current = pathname;
    if (phase.current === "covering" || phase.current === "covered") {
      resetScroll();
      // The new page's scroller was just created: keep it still until revealed.
      getLenis()?.stop();
      reveal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Back/forward land at the top too, not at the browser's remembered spot.
    history.scrollRestoration = "manual";

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page: hashes, scroll-to-top
      if (reduce() || phase.current !== "idle") return;

      e.preventDefault();
      e.stopPropagation();
      html().dataset.pageTransition = "";
      lock();
      assembledAt.current = performance.now() + ASSEMBLED_MS;
      setState("covering");
      const target = url.pathname + url.search + url.hash;
      const onCovered = (ev) => {
        if (ev.target.dataset?.last === undefined || ev.propertyName !== "transform") return;
        panel.current.removeEventListener("transitionend", onCovered);
        phase.current = "covered";
        router.push(target, { scroll: false }); // scrolled by resetScroll
        safety.current = setTimeout(reveal, SAFETY_MS);
      };
      panel.current.addEventListener("transitionend", onCovered);
    };

    const onPopState = () => {
      if (location.pathname === lastPath.current) return; // a hash step on the same page
      if (reduce() || phase.current !== "idle") {
        // No transition: still land at the top once the page has rendered.
        requestAnimationFrame(() => requestAnimationFrame(resetScroll));
        return;
      }
      // Hold the new page (already rendering) until the blocks have closed.
      let open;
      gate = new Promise((resolve) => (open = resolve));
      html().dataset.pageTransition = "";
      lock();
      assembledAt.current = performance.now() + ASSEMBLED_MS;
      setState("covering");
      const onCovered = (ev) => {
        if (ev.target.dataset?.last === undefined || ev.propertyName !== "transform") return;
        panel.current.removeEventListener("transitionend", onCovered);
        phase.current = "covered";
        gate = null;
        open();
        safety.current = setTimeout(reveal, SAFETY_MS);
      };
      panel.current.addEventListener("transitionend", onCovered);
    };

    const onTransitionEnd = (ev) => {
      if (ev.target.dataset?.last === undefined || ev.propertyName !== "transform" || phase.current !== "revealing") return;
      // Park the panel below the screen again, then let the page's own
      // load-in animations play.
      panel.current.dataset.instant = "";
      setState("idle");
      void panel.current.offsetWidth;
      delete panel.current.dataset.instant;
      delete html().dataset.pageTransition;
      unlock();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    panel.current.addEventListener("transitionend", onTransitionEnd);
    const node = panel.current;
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      node.removeEventListener("transitionend", onTransitionEnd);
      clearTimeout(safety.current);
      unlock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={panel} className={styles.panel} data-state="idle" data-transition-panel="" aria-hidden="true">
      {Array.from({ length: BLOCKS }, (_, i) => (
        <span key={i} className={styles.block} style={{ "--i": i }} data-last={i === BLOCKS - 1 ? "" : undefined} />
      ))}
      {/* The logo, centred: rises out of its mask as the middle blocks close
          over it, holds while the page loads, then lifts out first. */}
      <span className={styles.logoMask}>
        <TransitionLogo />
      </span>
    </div>
  );
}
