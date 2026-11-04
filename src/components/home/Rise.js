"use client";

import { useEffect, useRef, useState } from "react";
import { parseMixed } from "@/lib/serifLetters";
import useSerifLetters from "@/lib/useSerifLetters";
import styles from "./Rise.module.css";

// The original text entrance: each line (or letter) rises out of a mask.
// Plays when an ancestor has data-reveal="in" (see useReveal).

// `serif` ({ prev, next }: its neighbours) sets the letter in the serif,
// fitted to the capitals (lib/serifLetters.js); it rises with the rest.
export function Rise({ delay = 0, block = false, serif, children }) {
  return (
    <span className={block ? styles.maskBlock : styles.mask}>
      {serif ? (
        <span className={styles.item} style={{ "--d": `${delay}s` }} data-serif="" data-prev={serif.prev} data-next={serif.next}>
          <span data-serif-glyph="">{children}</span>
          <span data-serif-probe="" />
        </span>
      ) : (
        <span className={styles.item} style={{ "--d": `${delay}s` }}>
          {children}
        </span>
      )}
    </span>
  );
}

export function RiseLines({ text, base = 0, step = 0.1 }) {
  return text.split("\n").map((line, i) => (
    <Rise key={`${line}-${i}`} block delay={base + i * step}>
      {line}
    </Rise>
  ));
}

// Braces mark serif letters (2026-11-03, page titles: "A{e}th{e}r"), as in
// the hero and the footer.
export function RiseLetters({ text: source, base = 0 }) {
  const ref = useRef(null);
  useSerifLetters(ref);
  const { text, serif } = parseMixed(source);
  const side = (i) => (serif.has(i) ? "" : text[i] ?? ""); // a serif neighbour counts as a word's edge
  return (
    <span ref={ref} className={styles.letters} aria-hidden="true">
      {text.split("").map((letter, i) => (
        <Rise
          key={`${text}-${i}`}
          delay={base + i * 0.05}
          serif={serif.has(i) ? { prev: side(i - 1), next: side(i + 1) } : undefined}
        >
          {letter === " " ? " " : letter}
        </Rise>
      ))}
    </span>
  );
}

// Reveal when the trigger (the slide's title) reaches 85% of the viewport
// height, the usual "top 85%" point: the text starts rising as it comes into
// view, not after it is already half way up. Reset once the whole container is
// off screen, so the entrance replays on the next visit (as before).
export function useReveal(ref, triggerRef = ref) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const trigger = triggerRef.current ?? el;
    const enter = new IntersectionObserver(([e]) => e.isIntersecting && setRevealed(true), {
      rootMargin: "0px 0px -15% 0px",
    });
    // -1px: a slide left exactly touching the viewport edge (e.g. after the
    // settle snaps back) counts as off screen, so it still resets.
    const visible = new IntersectionObserver(([e]) => !e.isIntersecting && setRevealed(false), {
      rootMargin: "-1px 0px -1px 0px",
    });
    enter.observe(trigger);
    visible.observe(el);
    return () => {
      enter.disconnect();
      visible.disconnect();
    };
  }, [ref, triggerRef]);
  return revealed ? "in" : "hidden";
}
