"use client";

import { useEffect, useState } from "react";
import styles from "./Rise.module.css";

// The original text entrance: each line (or letter) rises out of a mask.
// Plays when an ancestor has data-reveal="in" (see useReveal).

export function Rise({ delay = 0, block = false, children }) {
  return (
    <span className={block ? styles.maskBlock : styles.mask}>
      <span className={styles.item} style={{ "--d": `${delay}s` }}>
        {children}
      </span>
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

export function RiseLetters({ text, base = 0 }) {
  return (
    <span className={styles.letters} aria-hidden="true">
      {text.split("").map((letter, i) => (
        <Rise key={`${text}-${i}`} delay={base + i * 0.05}>
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
