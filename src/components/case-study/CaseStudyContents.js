"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CaseStudy.module.css";
import { getLenis, scrollToTarget } from "@/lib/scroll";

// The content rail, held at the middle of the screen in column 1: the
// content list with a fine marker that glides to the current section (the
// one crossing the upper third of the screen). No scroll library.
//
// Entrance (mirrors the home page's project index): the label and links wipe
// in from the left edge one after another while the story crosses the middle
// of the screen, and out in reverse as it leaves (timed transitions, so the
// pace never depends on how fast the visitor scrolls; 2026-10-19).
//
// Below 1024px (2026-10-26, Jonathan: the in-page list broke the flow and was
// gone once scrolled past) the rail becomes a small corner control, fixed
// bottom-left and blended like the navbar: "[ 2 / 5 ] Key decisions", the
// current section in the story's order. It opens the full list in an ink
// panel (the menu's rising columns); choosing a section closes it and
// scrolls there. A modal dialog: Escape closes it, focus stays inside and
// returns to the control.
export default function CaseStudyContents({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [shown, setShown] = useState(false);
  const dialogRef = useRef(null);
  const toggleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));

  useEffect(() => {
    const story = document.getElementById("story");
    if (!story) return;
    const observer = new IntersectionObserver(([e]) => setShown(e.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    observer.observe(story);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -69% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // Measure the active link so the marker matches its height exactly.
  useEffect(() => {
    const link = listRef.current?.querySelector(`[data-id="${active}"]`);
    if (link) setMarker({ y: link.offsetTop, h: link.offsetHeight });
  }, [active]);

  const go = (e, id) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
    history.replaceState(null, "", `#${id}`);
    // Move focus to the section so keyboard and screen-reader users land there.
    target.focus({ preventScroll: true });
  };

  // The index panel: shown as a modal, then opened on the next frame so the
  // columns rise. Closing (2026-10-26): the content leaves first (sinking,
  // the entrance reversed), the columns drop 150 ms later, then the dialog
  // closes.
  const CLOSE_MS = 150 + 350 + 7 * 30;
  const closeTimer = useRef(0);
  const openIndex = () => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    clearTimeout(closeTimer.current);
    d.showModal();
    getLenis()?.stop();
    requestAnimationFrame(() => setOpen(true));
  };
  const closeIndex = (then) => {
    const d = dialogRef.current;
    if (!d?.open) return;
    setOpen(false);
    setClosing(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimer.current = setTimeout(() => {
      setClosing(false);
      d.close();
      getLenis()?.start();
      if (typeof then === "function") then();
      else toggleRef.current?.focus({ preventScroll: true });
    }, reduce ? 0 : CLOSE_MS);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  const goFromIndex = (e, id) => {
    e.preventDefault();
    closeIndex(() => go({ preventDefault() {} }, id));
  };

  return (
    <>
      <nav
        className={styles.contents}
        data-shown={shown}
        aria-label="Content"
        style={{ "--count": sections.length + 1 }}
      >
        <p className={styles.contentsLabel} style={{ "--i": 0 }}>
          Content
        </p>
        <div ref={listRef} className={styles.contentsTrack}>
          {marker && (
            <span
              className={styles.contentsMarker}
              style={{
                transform: `translateY(${marker.y}px)`,
                height: marker.h,
              }}
              aria-hidden="true"
            />
          )}
          <ul className={styles.contentsList}>
            {sections.map(({ id, title }, i) => (
              <li key={id} style={{ "--i": i + 1 }}>
                <a
                  href={`#${id}`}
                  data-id={id}
                  className={styles.contentsLink}
                  aria-current={active === id ? "location" : undefined}
                  onClick={(e) => go(e, id)}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Below 1024px: the corner control and its index panel. */}
      <button
        ref={toggleRef}
        type="button"
        className={styles.indexToggle}
        data-shown={shown}
        aria-haspopup="dialog"
        aria-label={`Content: ${sections[activeIndex]?.title}, section ${activeIndex + 1} of ${sections.length}`}
        onClick={openIndex}
      >
        {/* One bracket pair around the whole control, like every "[ … ]"
            button (2026-10-26): the counter muted inside it, the section in
            full. */}
        <span aria-hidden="true">
          <span className="bracket bracket-open">[</span>{" "}
          <span className={styles.indexCount}>
            {activeIndex + 1} / {sections.length}
          </span>{" "}
          {sections[activeIndex]?.title}{" "}
          <span className="bracket bracket-close">]</span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.indexPanel}
        data-open={open}
        data-closing={closing || undefined}
        aria-label="Content"
        onCancel={(e) => {
          e.preventDefault();
          closeIndex();
        }}
      >
        <div className={styles.indexColumns} aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{ "--i": i }} />
          ))}
        </div>
        <nav className={styles.indexBody} aria-label="Content">
          <p className={styles.indexLabel}>
            <span className={styles.indexRise} style={{ "--i": 0 }}>
              Content
            </span>
          </p>
          <ol className={styles.indexList}>
            {sections.map(({ id, title }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`${styles.indexLink} ${styles.indexRise}`}
                  style={{ "--i": i + 1 }}
                  aria-current={active === id ? "location" : undefined}
                  onClick={(e) => goFromIndex(e, id)}
                >
                  <span className={styles.indexNumber} aria-hidden="true">
                    <span className="bracket bracket-open">[</span> {i + 1} <span className="bracket bracket-close">]</span>
                  </span>
                  {title}
                </a>
              </li>
            ))}
          </ol>
          <button type="button" className={styles.indexClose} onClick={() => closeIndex()}>
            <span className="bracket bracket-open">[</span> Close <span className="bracket bracket-close">]</span>
          </button>
        </nav>
      </dialog>
    </>
  );
}
