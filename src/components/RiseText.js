"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./RiseText.module.css";

// Text that rises out of a mask line by line, using the lines the browser
// actually lays out (re-measured on resize and once fonts load), so a
// paragraph rises per line, not as one block.
//
// mode="scroll" (default): the lines rise in one after another when the text
//   comes into view (trigger-based since 2026-10-19, see ViewTrigger), on a
//   fixed timing however fast the visitor scrolls; it replays when scrolled
//   back up past and into view again.
// mode="load": for text that's on screen at load (above the fold): lines
//   rise in one after another (50 ms apart) after `delay` seconds.
//
// `lead` is an optional bold run before the text (e.g. a lesson's title).
// Without IntersectionObserver, or with reduced motion, the text shows without a rise.

const splitWords = (lead, text) => [
  ...(lead ? lead.split(" ").map((w) => ({ w, lead: true })) : []),
  ...text.split(" ").map((w) => ({ w, lead: false })),
];

// trim: the text is trimmed to its capitals (text-box), e.g. the hero byline;
// the trim is carried onto the first and last line masks.
export default function RiseText({ text, lead = "", mode = "scroll", delay = 0, trim = false, as: Tag = "span", className = "", leadClassName = "" }) {
  const ref = useRef(null);
  const words = splitWords(lead, text);
  const [lines, setLines] = useState(null); // arrays of word indexes, or null while measuring
  const width = useRef(0);

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll("[data-w]");
    if (!spans.length) return;
    const grouped = [];
    let top = null;
    spans.forEach((s, i) => {
      const t = s.offsetTop;
      if (top === null || Math.abs(t - top) > 2) {
        grouped.push([]);
        top = t;
      }
      grouped[grouped.length - 1].push(i);
    });
    setLines(grouped);
  };

  // Re-measure by bumping a counter: back to plain words, then group them.
  const [version, setVersion] = useState(0);
  const remeasure = () => {
    setLines(null);
    setVersion((v) => v + 1);
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, text, lead]);

  // Re-measure when the width changes and when web fonts finish loading.
  // The text itself is usually an inline span, which a ResizeObserver never
  // reports on, so watch the nearest block-level container instead.
  useLayoutEffect(() => {
    const el = ref.current;
    let box = el.parentElement ?? el;
    while (box.parentElement && getComputedStyle(box).display === "inline") box = box.parentElement;
    width.current = box.clientWidth;
    const ro = new ResizeObserver(() => {
      if (box.clientWidth !== width.current) {
        width.current = box.clientWidth;
        remeasure();
      }
    });
    ro.observe(box);
    let alive = true;
    // Fonts that finish loading after the first measure (fallback-font lines
    // would otherwise stay frozen). Only fires when a font actually loads, so
    // returning to a page doesn't restart the rise.
    const onFonts = () => alive && remeasure();
    if (document.fonts) {
      if (document.fonts.status !== "loaded") document.fonts.ready.then(onFonts);
      document.fonts.addEventListener("loadingdone", onFonts);
    }
    return () => {
      alive = false;
      ro.disconnect();
      document.fonts?.removeEventListener("loadingdone", onFonts);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const word = ({ w, lead: isLead }, key, last) => (
    <span key={key} data-w="" className={isLead ? leadClassName : undefined}>
      {w}
      {last ? "" : " "}
    </span>
  );

  return (
    <Tag ref={ref} className={`${styles.text} ${className}`} data-mode={mode} data-trigger={mode === "scroll" ? "" : undefined} data-trim={trim || undefined} style={{ "--delay": `${delay}s` }}>
      {/* Lines measured for other text (the text just changed) wait for
          the re-measure rather than point at words that aren't there. */}
      {lines === null || lines.some((idx) => idx.some((i) => i >= words.length))
        ? words.map((wd, i) => word(wd, i, i === words.length - 1))
        : lines.map((idx, l) => (
            <span key={l} className={styles.line} style={{ "--l": l }}>
              <span className={styles.lineInner}>
                {idx.map((i, k) => word(words[i], i, k === idx.length - 1))}
              </span>
            </span>
          ))}
    </Tag>
  );
}

// A display title whose letters rise one after another, left to right, when
// the title comes into view (trigger-based since 2026-10-19, ViewTrigger).
export function RiseLettersScroll({ text, start = 0, className = "" }) {
  return (
    <span className={`${styles.letters} ${className}`} data-trigger="" aria-hidden="true">
      {text.split("").map((letter, i) => (
        <span key={i} className={styles.letterMask}>
          <span className={styles.letter} style={{ "--i": start + i }}>
            {letter === " " ? " " : letter}
          </span>
        </span>
      ))}
    </span>
  );
}

// One line of arbitrary content (icons, brackets, links) in a single rising
// mask, in either mode. trim: as RiseText's; "start" trims above the capitals
// only (the first line of a list, keeping the list's line spacing).
export function RiseLine({ children, mode = "scroll", delay = 0, index = 0, trim = false, className = "" }) {
  return (
    <span className={`${styles.text} ${className}`} data-mode={mode} data-trigger={mode === "scroll" ? "" : undefined} data-trim={trim || undefined} style={{ "--delay": `${delay}s` }}>
      <span className={styles.line} style={{ "--l": index }}>
        <span className={styles.lineInner}>{children}</span>
      </span>
    </span>
  );
}
