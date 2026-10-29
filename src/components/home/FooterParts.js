"use client";

import { useEffect, useRef } from "react";

// The footer's live part: fitting the question to the margins.

// Text that spans its container exactly (desktop): measures the widest
// [data-fit-line] child (or the text itself) at its CSS size and scales the
// font so it meets both margins. Below 1024px it wraps and keeps its CSS size.
export function FitLine({ as: Tag = "p", className, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const wide = window.matchMedia("(min-width: 1024px)");
    const fit = () => {
      el.style.fontSize = "";
      if (!wide.matches) return;
      const lines = el.querySelectorAll("[data-fit-line]");
      const parts = lines.length ? [...lines] : [el.lastElementChild];
      const widest = Math.max(...parts.map((n) => n.getBoundingClientRect().width));
      const size = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = `${((size * el.clientWidth) / widest).toFixed(2)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement);
    wide.addEventListener("change", fit);
    return () => {
      ro.disconnect();
      wide.removeEventListener("change", fit);
    };
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
