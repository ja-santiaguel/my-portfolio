"use client";

import { useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import styles from "./Cursor.module.css";
import { splitBrackets } from "./Bracketed";

// Things that act on click get the pointing hand.
const INTERACTIVE = "a[href], button, [role='button'], label, select, summary, [data-cursor='pointer']";
// Elements with data-cursor-label="…" replace the cursor with a label block.
const LABELLED = "[data-cursor-label]";

// Minimal custom cursor: an arrow that becomes a pointing hand over
// interactive elements, drawn white with mix-blend-mode: difference so it
// reads black on the light page and inverts over images and dark areas.
// Over labelled targets (showcase images) it becomes a solid label block,
// a separate element so the block itself isn't inverted.
// Mouse/trackpad only; touch devices keep their native behaviour.
export default function Cursor() {
  const ref = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const el = ref.current;
    const label = labelRef.current;
    const block = label.firstChild;
    const text = block.querySelector("[data-text]");
    const html = document.documentElement;
    html.classList.add("custom-cursor");

    let x = -1;
    let y = -1;
    let queued = 0;

    const update = (target) => {
      const labelled = target?.closest(LABELLED);
      if (labelled) {
        // "[ View ]" shows as [ (magnifier) VIEW ]; any other label as plain text.
        const value = labelled.dataset.cursorLabel;
        const inner = splitBrackets(value);
        block.dataset.action = inner === null ? "false" : "true";
        const shown = inner ?? value;
        if (text.textContent !== shown) text.textContent = shown;
        el.dataset.mode = "label";
        label.dataset.show = "true";
        return;
      }
      label.dataset.show = "false";
      const interactive = target?.closest(INTERACTIVE);
      const enabled = interactive && !interactive.matches(":disabled, [aria-disabled='true']");
      el.dataset.mode = enabled ? "pointer" : "arrow";
    };

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const at = `translate3d(${x}px, ${y}px, 0)`;
      el.style.transform = at;
      label.style.transform = at;
      el.dataset.visible = "true";
      update(e.target instanceof Element ? e.target : null);
    };

    // Content can move under a still pointer (scrolling, animations): re-check
    // what is under it, at most once per frame.
    const recheck = () => {
      if (queued || x < 0) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        update(document.elementFromPoint(x, y));
      });
    };
    const hide = () => {
      el.dataset.visible = "false";
      label.dataset.show = "false";
    };
    const press = () => (el.dataset.pressed = label.dataset.pressed = "true");
    const release = () => (el.dataset.pressed = label.dataset.pressed = "false");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", recheck, { passive: true });
    window.addEventListener("cursor:refresh", recheck);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    html.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      html.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", recheck);
      window.removeEventListener("cursor:refresh", recheck);
      cancelAnimationFrame(queued);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      html.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <>
      <div ref={ref} className={styles.cursor} data-mode="arrow" data-visible="false" aria-hidden="true">
        <svg className={`${styles.shape} ${styles.arrow}`} width="15" height="19" viewBox="0 0 15 19">
          <path d="M1 1V17L5.8 12.4H13.5Z" fill="currentColor" />
        </svg>
        <svg className={`${styles.shape} ${styles.hand}`} width="21" height="24" viewBox="0 0 21 24">
          <path
            d="M6 15V2.5A1.5 1.5 0 0 1 9 2.5V10H9.5V7.5A1.5 1.5 0 0 1 12.5 7.5V10H13V8.5A1.5 1.5 0 0 1 16 8.5V10.5H16.5A1.5 1.5 0 0 1 19.5 10.5V16.5A6.5 6.5 0 0 1 13 23H11.5A6 6 0 0 1 6.8 20.7L1.9 15.4A1.6 1.6 0 0 1 4.3 13.3Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div ref={labelRef} className={styles.label} data-show="false" aria-hidden="true">
        <span className={styles.labelBlock} data-action="true">
          <span className={styles.actionPart}>
            <span className="bracket">[</span>{" "}
            <CiSearch className="action-icon" aria-hidden="true" focusable="false" />{" "}
          </span>
          <span data-text="" />
          <span className={styles.actionPart}>
            {" "}
            <span className="bracket">]</span>
          </span>
        </span>
      </div>
    </>
  );
}
