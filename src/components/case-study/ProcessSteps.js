"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CaseStudy.module.css";
import Bracketed from "../Bracketed";
import RiseText, { RiseLine } from "../RiseText";

// The process as a scroll-told sequence. A stage (columns 2-6) holds while
// the steps scroll past beside it (7-8); the step crossing the middle of the
// screen is the current one: its text turns ink and its artefact clip-opens
// from the top over the previous one. Every artefact shares one composition
// (desktop left, phone right), so the stage reads as one design gaining
// fidelity: sketch, wireframe, high fidelity, build.
//
// State comes from scroll position, so scrolling back plays it in reverse.
// Below 1024px there is no stage: each step shows its own artefact.


export default function ProcessSteps({ steps }) {
  const listRef = useRef(null);
  const [current, setCurrent] = useState(0);

  // The current step is worked out from where the steps are on every scroll
  // (2026-10-19): the last step whose top has passed the middle of the screen,
  // the first before any has. Remembering the last step to cross the middle
  // went stale on a fast scroll past the section, so coming back the stage
  // briefly showed Build.
  useEffect(() => {
    const items = [...listRef.current.querySelectorAll("[data-step]")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let i = 0;
      items.forEach((el, k) => {
        if (el.getBoundingClientRect().top <= middle) i = k;
      });
      setCurrent(i);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.process}>
      <div className={styles.stageColumn} aria-hidden="true">
        <div className={styles.stageSticky}>
          <div className={styles.stage} data-media="" data-trigger="">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={styles.stageImage}
                data-shown={current === i}
              >
                <Image
                  src={s.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={styles.stageImg}
                  style={s.scale ? { "--scale": s.scale } : undefined}
                />
              </div>
            ))}
          </div>
          <p className={styles.stageCaption}>
            <span>
              <Bracketed>{`[ ${current + 1} / ${steps.length} ]`}</Bracketed>
            </span>
            <span>{steps[current].title}</span>
          </p>
        </div>
      </div>

      <ol ref={listRef} className={styles.steps}>
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={styles.step}
            data-step={i}
            data-current={current === i}
          >
            <figure className={styles.stepFigure}>
              <Image
                src={s.image.src}
                alt={s.image.alt}
                width={s.image.width}
                height={s.image.height}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className={styles.plateImage}
              />
            </figure>
            <p className={styles.stepTitle}>
              <RiseLine>
                <span className={styles.stepNo}>
                  <Bracketed>{`[ ${i + 1} ]`}</Bracketed>
                </span>{" "}
                {s.title}
              </RiseLine>
            </p>
            <p className={styles.stepText}>
              <RiseText text={s.text} />
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
