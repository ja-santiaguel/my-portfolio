"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scroll-driven effects for browsers without CSS scroll timelines (Firefox,
// 2026-10-29), played from the scroll position with the same ranges and
// keyframes as their CSS. Elsewhere the CSS runs and this does nothing.
// The home slides' opening clip has its own fallback (useMediaParallax).
//   - The footer's ink columns (ContactSection.module.css, endingColumn over
//     entry 0%-97% of the footer): [data-ending-columns].
//   - Scroll-tracked ink fill (InkText.module.css, inkFill over cover
//     12-48%, 8% per word, on the [data-ink="scroll"] block or the line
//     itself): [data-ink-scroll].
export const SCROLL_TIMELINES = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function update() {
  const vh = window.innerHeight;

  document.querySelectorAll("[data-ending-columns]").forEach((columns) => {
    const r = columns.parentElement.getBoundingClientRect();
    const k = 1 - clamp01((vh - r.top) / (0.97 * Math.min(r.height, vh)));
    [...columns.children].forEach((span, i) => {
      span.style.transform = `translateY(${((10 + i * 22) * k).toFixed(3)}%)`;
    });
  });

  document.querySelectorAll("[data-ink-scroll]").forEach((line) => {
    const r = (line.closest('[data-ink="scroll"]') ?? line).getBoundingClientRect();
    const cover = (vh - r.top) / (vh + r.height);
    const n = Number(line.style.getPropertyValue("--n"));
    const ink = getComputedStyle(line).color;
    [...line.children].forEach((word) => {
      const start = 0.12 + (Number(word.style.getPropertyValue("--w")) / n) * 0.28;
      const t = clamp01((cover - start) / 0.08);
      word.style.color = `color-mix(in srgb, ${ink} ${(t * 100).toFixed(1)}%, var(--ink-faint))`;
    });
  });
}

export default function ScrollTimelineFallback() {
  const pathname = usePathname();

  useEffect(() => {
    if (SCROLL_TIMELINES || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frameId = 0;
    const wake = () => {
      if (!frameId) frameId = requestAnimationFrame(() => {
        frameId = 0;
        update();
      });
    };
    // Now and again next frame: a new page may still be mounting.
    update();
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, [pathname]);

  return null;
}
