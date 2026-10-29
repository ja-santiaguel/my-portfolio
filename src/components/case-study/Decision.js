"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./CaseStudy.module.css";
import Bracketed from "../Bracketed";
import RiseText, { RiseLine } from "../RiseText";

// One key decision (2026-10-18): a scanning path in three steps.
//   1. A numbered headline across the content width: the decision.
//   2. One strip read across once: Client ask (the brief, word for word, or
//      "Beyond the brief"), Why, and Trade-off.
//   3. The screen (content columns 1-4) with its notes beside it (5-6, held
//      in view while the screen scrolls), so the effect of pointing at a note
//      is always in sight. (Notes above the screen were awkward to use.)
// Pointing at a note (hover, keyboard focus or a tap) closes a darkening in
// from the screen's edges onto the area it describes: a reverse clip reveal
// that leaves only that area clear. A tap keeps it.
//
// Every screen is a 2x capture of one region at the same width, so UI text
// reads about the same size on each, with a title block above (page and
// viewport) and a hairline edge.
//
// Options (2026-10-19, for projects without a client, e.g. Aether):
// `askLabel` renames the first cell ("Research finding") and shows it
// unquoted; `tradeoffLabel` renames the third ("What testing changed");
// `device: "phone"` shows a phone screen, two columns wide, notes beside it.
//
// One shade layer, cut by an even-odd polygon: an outer frame minus an inner
// hole. At rest the hole is the whole frame (nothing shaded); active, the
// hole shrinks to the feature. Both shapes have the same points, so the
// browser animates between them.

const PAD = 1.2; // breathing room around the feature, in %

const hole = (rect) => {
  if (!rect) return [0, 0, 100, 100];
  const [x, y, w, h] = rect;
  return [
    Math.max(0, x - PAD),
    Math.max(0, y - PAD),
    Math.min(100, x + w + PAD),
    Math.min(100, y + h + PAD),
  ];
};

const shape = ([x0, y0, x1, y1]) =>
  `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${x0}% ${y0}%, ${x1}% ${y0}%, ${x1}% ${y1}%, ${x0}% ${y1}%, ${x0}% ${y0}%)`;

export default function Decision({ index, decision }) {
  const { title, ask, askLabel, why, tradeoff, tradeoffLabel, image, callouts, frame, device } = decision;
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const current = hovered ?? pinned;

  return (
    <article className={styles.decision} data-device={device}>
      <h3 className={styles.decisionTitle}>
        <span className={styles.decisionNo}>
          <RiseLine>
            <Bracketed>{`[ ${index + 1} ]`}</Bracketed>
          </RiseLine>
        </span>
        <span className={styles.heading}>
          <RiseText text={title} />
        </span>
      </h3>

      <div className={styles.decisionStrip}>
        <div className={styles.decisionCell}>
          <p className={styles.inlineLabel}>
            <RiseLine>{askLabel ?? "Client ask"}</RiseLine>
          </p>
          <p className={styles.decisionText}>
            <RiseText text={askLabel ? ask : ask ? `“${ask}”` : "Beyond the brief"} />
          </p>
        </div>
        <div className={`${styles.decisionCell} ${tradeoff ? "" : styles.decisionWide}`}>
          <p className={styles.inlineLabel}>
            <RiseLine>Why</RiseLine>
          </p>
          <p className={styles.decisionText}>
            <RiseText text={why} />
          </p>
        </div>
        {tradeoff && (
          <div className={styles.decisionCell}>
            <p className={styles.inlineLabel}>
              <RiseLine>{tradeoffLabel ?? "Trade-off"}</RiseLine>
            </p>
            <p className={styles.decisionText}>
              <RiseText text={tradeoff} />
            </p>
          </div>
        )}
      </div>

      <figure className={styles.decisionFigure}>
        {frame && (
          <figcaption className={`${styles.label} ${styles.frameTitle}`}>
            <RiseLine>{frame}</RiseLine>
          </figcaption>
        )}
        <div className={styles.annotatedMedia} data-media="" data-trigger="">
          <div className={styles.parallaxLayer}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={device === "phone" ? "(min-width: 1024px) 22vw, 70vw" : "(min-width: 1024px) 45vw, 100vw"}
              className={styles.plateImage}
            />
            <div
              className={styles.focusShade}
              data-active={current !== null}
              style={{
                clipPath: shape(
                  hole(current !== null ? callouts[current].rect : null),
                ),
              }}
              aria-hidden="true"
            />
          </div>
        </div>
        <div className={styles.decisionNotes}>
          <p className={styles.inlineLabel}>
            <RiseLine>What to notice</RiseLine>
          </p>
          <ol className={styles.notesList}>
            {callouts.map((c, i) => (
              <li key={c.text}>
                <button
                  type="button"
                  className={styles.note}
                  data-active={current === i}
                  aria-pressed={pinned === i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setPinned((p) => (p === i ? null : i))}
                >
                  <span className={styles.noteNo}>
                    <Bracketed>{`[ ${i + 1} ]`}</Bracketed>
                  </span>
                  <span>{c.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </figure>
    </article>
  );
}
