"use client";

import { useEffect } from "react";

// Trigger-based entrances (2026-10-19), replacing scroll-driven ones for text,
// media, rules and the case-study content list: timings stay consistent and
// fluid however fast the visitor scrolls.
//
// One observer for the whole site. Any element with [data-trigger] gets
// [data-in] when it comes into view (its top crosses into the bottom
// `data-trigger` % of the screen, default 12), and CSS plays a timed
// animation from there. It loses [data-in] only when it leaves through the
// bottom (scrolled back above it), so the entrance replays when it comes back
// up into view, but never replays while scrolling on past it. Leaving, it gets
// [data-out] for the length of the exit animation (2026-10-19: without it the
// content vanished instantly while still on screen).
//
// Exits come a little sooner than entrances (2026-10-19): scrolling back up,
// content leaves once its top drops below a line 8% of the screen above the
// entry line (20% from the bottom by default), if it had risen above that
// line; otherwise when it drops back below the entry line. Scrolling down
// again it comes back at whichever line it left by, so it never flips.
//
// Exits are judged by where the element rests, not where its own animation
// has moved it (2026-10-19): a screen starts its entrance 3rem low, which
// dropped it back below the line, so it flipped between entering and leaving
// every frame and flickered.
//
// html[data-trigger-ready] is set once this is running, so content is only
// hidden ahead of its entrance when something will reveal it.
export default function ViewTrigger() {
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    // The element's top without its own transform (ancestors don't animate).
    const restingTop = (el, e) => {
      const t = getComputedStyle(el).transform;
      return e.boundingClientRect.top - (t && t !== "none" ? new DOMMatrixReadOnly(t).m42 : 0);
    };

    const EXIT_LEAD = 8; // the exit line, in % of the screen above the entry line

    // While a page transition covers the page (html[data-page-transition]),
    // entrances wait and play once it lifts (2026-10-19): arriving on a page
    // by "Back to work" or the navbar, its lines and text drew in behind the
    // cover and were never seen.
    // The same while the work switches between list and grid (2026-10-20):
    // titles enter once the images have rearranged.
    const held = () => html.hasAttribute("data-page-transition") || html.hasAttribute("data-layout-switching");
    const pending = new Set();

    const enter = (el) => {
      if (held()) {
        pending.add(el);
        return;
      }
      el.removeAttribute("data-out");
      el.setAttribute("data-in", "");
    };
    // Exits keep the page's order (2026-10-27, Jonathan: Services' exits felt
    // random): an element that never rose above the exit line waits for the
    // entry line, so it could stay while one above it left. Whatever sits
    // lower in the same section now leaves with the element above it.
    const leave = (el, cascade = true) => {
      pending.delete(el);
      if (!el.hasAttribute("data-in")) return;
      el.removeAttribute("data-in");
      el.setAttribute("data-out", "");
      const section = cascade && el.closest("section");
      if (!section) return;
      const top = el.getBoundingClientRect().top;
      watched.forEach((other) => {
        if (other === el || !other.hasAttribute("data-in") || !section.contains(other)) return;
        if (other.getBoundingClientRect().top <= top + 1) return;
        aboveExit.delete(other);
        settled.delete(other);
        leave(other, false);
      });
    };
    // Below the observer's line (its root's bottom edge, margins applied)?
    const below = (el, e) => restingTop(el, e) >= (e.rootBounds ? e.rootBounds.bottom - 1 : 1);

    const observers = new Map(); // "enter|exit:margin" -> IntersectionObserver
    const watched = new Set();
    const aboveExit = new WeakSet(); // risen above the exit line since entering

    const observerFor = (kind, margin) => {
      const key = `${kind}:${margin}`;
      if (!observers.has(key)) {
        const onEnterLine = (e) => {
          if (e.isIntersecting) enter(e.target);
          else if (below(e.target, e)) leave(e.target);
        };
        const onExitLine = (e) => {
          const el = e.target;
          if (!below(el, e)) {
            aboveExit.add(el);
            enter(el); // back above the line it left by
          } else if (aboveExit.has(el)) {
            aboveExit.delete(el);
            leave(el);
          }
        };
        observers.set(
          key,
          new IntersectionObserver((entries) => entries.forEach(kind === "enter" ? onEnterLine : onExitLine), {
            rootMargin: `0px 0px -${kind === "enter" ? margin : margin + EXIT_LEAD}% 0px`,
          })
        );
      }
      return observers.get(key);
    };

    const watch = (root) => {
      const list = root.matches?.("[data-trigger]") ? [root] : [];
      root.querySelectorAll?.("[data-trigger]").forEach((el) => list.push(el));
      list.forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        const margin = parseFloat(el.getAttribute("data-trigger")) || 12;
        observerFor("enter", margin).observe(el);
        observerFor("exit", margin).observe(el);
      });
    };

    watch(document.body);
    html.setAttribute("data-trigger-ready", "");

    // At rest, nothing on screen stays hidden (2026-10-23): a section that
    // locks into place can leave its last lines (a slide's "[ View case study ]"
    // on a short window) inside the bottom band, short of the entry line, and
    // with the page still they never crossed it. Once scrolling settles,
    // whatever is on screen and not yet in plays; when one of those is later
    // scrolled back below the screen, it resets like the others.
    const settled = new Set();
    let settleTimer = 0;
    const settle = () => {
      if (held()) return;
      const vh = window.innerHeight;
      watched.forEach((el) => {
        if (!el.isConnected) {
          watched.delete(el);
          settled.delete(el);
          return;
        }
        const r = el.getBoundingClientRect();
        if (settled.has(el) && r.top >= vh) {
          settled.delete(el);
          leave(el);
        } else if (!el.hasAttribute("data-in") && r.top < vh && r.bottom > 0 && r.height > 0) {
          settled.add(el);
          enter(el);
        }
      });
    };
    const onScroll = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // The cover lifted: play what arrived underneath it.
    const release = new MutationObserver(() => {
      if (held() || !pending.size) return;
      const list = [...pending];
      pending.clear();
      requestAnimationFrame(() => list.forEach((el) => el.isConnected && enter(el)));
    });
    release.observe(html, { attributes: true, attributeFilter: ["data-page-transition", "data-layout-switching"] });

    // New pages and re-measured text add elements later.
    const mo = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach((n) => n.nodeType === 1 && watch(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settleTimer);
      mo.disconnect();
      release.disconnect();
      observers.forEach((o) => o.disconnect());
      html.removeAttribute("data-trigger-ready");
    };
  }, []);

  return null;
}
