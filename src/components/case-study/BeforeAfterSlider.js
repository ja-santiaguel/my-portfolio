"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CaseStudy.module.css";
import Bracketed from "../Bracketed";
import RiseText from "../RiseText";

// Before/after on top of each other; drag (or use the arrow keys) to move the
// divide. A native range input drives it, so it works with keyboard, touch
// and screen readers.
//
// Feel: one animation loop runs while the divide is moving and always reads
// the latest target, so the divide follows the pointer closely (a ~35 ms
// critically damped follow) and reverses direction instantly, with no
// restart lag. The side with less of the frame dims and blurs gradually, so
// attention sits on whichever version is mostly in view.
const FOLLOW = 28; // per second
const MAX_DIM = 0.42; // ink overlay at the extremes
const MAX_BLUR = 3; // px

// `start` sets where the divide rests at first (% from the left).
export default function BeforeAfterSlider({ before, after, caption, title, start = 50 }) {
  const [value, setValue] = useState(start); // the input's value (keyboard / a11y)
  const frameRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const target = useRef(start);
  const shown = useRef(start);
  const raf = useRef(0);
  const reduce = useRef(false);

  const paint = (pos) => {
    frameRef.current.style.setProperty("--pos", `${pos.toFixed(2)}%`);
    // 0 at the middle, 1 at either end; only the smaller side is shaded.
    const lean = Math.min(1, Math.abs(pos - 50) / 50);
    const shaded = pos > 50 ? rightRef.current : leftRef.current;
    const clear = pos > 50 ? leftRef.current : rightRef.current;
    shaded.style.background = `rgb(21 21 21 / ${(lean * MAX_DIM).toFixed(3)})`;
    shaded.style.backdropFilter = `blur(${(lean * MAX_BLUR).toFixed(2)}px)`;
    clear.style.background = "transparent";
    clear.style.backdropFilter = "none";
  };

  const last = useRef(0);
  const tick = (now) => {
    const dt = last.current ? Math.min((now - last.current) / 1000, 1 / 30) : 1 / 60;
    last.current = now;
    const diff = target.current - shown.current;
    if (reduce.current || Math.abs(diff) < 0.05) {
      shown.current = target.current;
      paint(shown.current);
      raf.current = 0;
      last.current = 0;
      return;
    }
    shown.current += diff * (1 - Math.exp(-FOLLOW * dt));
    paint(shown.current);
    raf.current = requestAnimationFrame(tick);
  };

  const moveTo = (pos) => {
    target.current = pos;
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint(start);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <figure className={styles.figureWide}>
      {title && (
        <p className={`${styles.label} ${styles.frameTitle}`}>
          <RiseText text={title} />
        </p>
      )}
      <div ref={frameRef} className={styles.compare} data-media="" data-trigger="" style={{ "--pos": `${start}%` }}>
        <div>
          <div className={styles.parallaxLayer}>
            <Image src={before.src} alt={before.alt} width={before.width} height={before.height} sizes="(min-width: 1024px) 65vw, 100vw" className={styles.compareImage} />
            <div className={styles.compareAfter}>
              <Image src={after.src} alt={after.alt} width={after.width} height={after.height} sizes="(min-width: 1024px) 65vw, 100vw" className={styles.compareImage} />
            </div>
          </div>
        </div>
        <span ref={leftRef} className={`${styles.compareShade} ${styles.compareShadeLeft}`} aria-hidden="true" />
        <span ref={rightRef} className={`${styles.compareShade} ${styles.compareShadeRight}`} aria-hidden="true" />
        <span className={`${styles.compareTag} ${styles.compareTagBefore}`} aria-hidden="true">
          <Bracketed>[ Before ]</Bracketed>
        </span>
        <span className={`${styles.compareTag} ${styles.compareTagAfter}`} aria-hidden="true">
          <Bracketed>[ After ]</Bracketed>
        </span>
        <span className={styles.compareHandle} aria-hidden="true">
          {/* Chevrons instead of brackets (2026-10-26, Jonathan): the same
              pair-of-marks framing as the site's labels, pointing both ways
              the divide moves. Helvetica's chevrons sit low like its brackets
              (ink centre 0.26em vs the capitals' 0.355em, measured), so they
              take the same raise (.bracket). */}
          <span className={styles.compareGrip}>
            <span className="bracket chevron-back">&lt;</span> Drag <span className="bracket chevron-forward">&gt;</span>
          </span>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            setValue(v);
            moveTo(v);
          }}
          className={styles.compareRange}
          aria-label="Compare the old and new homepage: left shows before, right shows after"
          aria-valuetext={`${value}% before, ${100 - value}% after`}
          data-cursor="pointer"
        />
      </div>
      {caption && (
        <figcaption className={styles.caption}>
          <RiseText text={caption} />
        </figcaption>
      )}
    </figure>
  );
}
