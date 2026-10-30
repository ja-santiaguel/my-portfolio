"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import styles from "./HeroStage.module.css";
import { getLenis } from "@/lib/scroll";
import { springSmooth, DURATION } from "@/lib/motion";
import SplitFlapWord from "./SplitFlapWord";
import Link from "next/link";
import { mediaCursorLabel } from "@/content/projects";
import RiseText from "../RiseText";

// Title flips (split-flap), one word per step, in this exact order:
// frontend developer -> frontend designer -> visual designer -> visual developer -> (repeat)
// (the bottom word changes first). Values are [top word index, bottom word
// index] into profile.heroWords.
const TITLE_SEQUENCE = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];
const FLIP_EVERY_MS = 5500;
// The first cut lands when the montage window's grow-in (a CSS spring) has
// visually settled: this far through it.
const GROW_SETTLED = 0.75;

function useTitleCycle() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const next = () => {
      setStep((s) => (s + 1) % TITLE_SEQUENCE.length);
      timer = setTimeout(next, FLIP_EVERY_MS);
    };
    // The first flip waits a full interval after the title has risen in
    // (i.e. after the opening montage, when there is one).
    const waitForIntro = () => {
      if (document.documentElement.dataset.intro === "playing") timer = setTimeout(waitForIntro, 200);
      else timer = setTimeout(next, FLIP_EVERY_MS);
    };
    waitForIntro();
    return () => clearTimeout(timer);
  }, []);
  return TITLE_SEQUENCE[step];
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerpRect = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const coverSize = (w, h, aspect) => (w / h > aspect ? [w, w / aspect] : [h * aspect, h]);

// The frame lives on the page (it scrolls with it, no hang). Its move and
// resize into the first project trail the scroll with a critically damped
// follow (soft start, ~0.5 s to half, settled in ~1 s, never overshoots),
// measured from noth.in. The project image wipes in first, then the frame
// settles into the panel.
const FOLLOW = 4.2;

// Opening montage: a small square of cuts that expands into the portrait.
// Motion-design pacing: it starts slow and accelerates (each cut ~11% shorter
// than the last) into a hard cut to the portrait. Media repeats to fill it.
const CUT_COUNT = 16;
const FIRST_CUT_MS = 280;
const LAST_CUT_MS = 45;
const CUTS = Array.from({ length: CUT_COUNT }, (_, i) =>
  Math.round(FIRST_CUT_MS * Math.pow(LAST_CUT_MS / FIRST_CUT_MS, i / (CUT_COUNT - 1)))
);
const MONTAGE_SIZE = 0.5; // square side, in portrait-card widths
const HOLD_MS = 250; // pause on the portrait before expanding
const RESIZE_MS = DURATION.long; // square -> portrait card
const SKIP_RESIZE_MS = DURATION.short;
const WIPE_END = 0.35; // the project wipe completes by this much of the flight
// The flying Aether image becomes clickable ([ VIEW ] cursor) the moment its
// wipe finishes, i.e. as soon as the visitor can see it, while still en route.
const CLICKABLE_FROM = WIPE_END;

// All project media, round-robin across projects so neighbours differ.
const interleave = (projects) => {
  const out = [];
  const longest = Math.max(...projects.map((p) => p.media.length));
  for (let i = 0; i < longest; i++) projects.forEach((p) => p.media[i] && out.push(p.media[i]));
  return out;
};

function useHeroMotion({ refs, portrait }) {
  useEffect(() => {
    const { stage, heroSlot, flyer, portraitBox, montage, cover, flyerLink } = Object.fromEntries(
      Object.entries(refs).map(([k, r]) => [k, r.current])
    );
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aspect = portrait.width / portrait.height;
    const { focus, heroZoom } = portrait;

    let from, to, montageRect, start, distance, target;
    let p = 0;
    let shown = 0;
    let velocity = 0;
    let last = 0;
    let frame = 0;
    let cancelled = false;
    // Opening sequence: "montage" (cuts, hold, then resize via `intro` 0..1).
    let phase = html.dataset.intro === "playing" ? "montage" : "flight";
    // A refresh mid-page restores the scroll position: skip the montage then.
    if (phase === "montage" && window.scrollY > 10) {
      phase = "flight";
      html.dataset.intro = "done";
    }
    let intro = 0;

    const rectIn = (el, base) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
    };

    const measure = () => {
      const base = stage.getBoundingClientRect();
      from = rectIn(heroSlot, base);
      if (target) target.style.opacity = target.style.pointerEvents = "";
      target = document.querySelector("[data-flight-target]");
      to = target ? rectIn(target, base) : from;
      start = base.top + window.scrollY;
      distance = base.height || 1;
      const side = Math.max(96, from.w * MONTAGE_SIZE);
      montageRect = { x: from.x + (from.w - side) / 2, y: from.y + (from.h - side) / 2, w: side, h: side };
    };

    const progress = () => clamp((window.scrollY - start) / distance, 0, 1);

    const placePortrait = (box, zoom) => {
      const [cw, ch] = coverSize(box.w, box.h, aspect);
      const w = cw * zoom;
      const h = ch * zoom;
      const x = clamp(box.w / 2 - focus.x * w, box.w - w, 0);
      const y = clamp(box.h / 2 - focus.y * h, box.h - h, 0);
      portraitBox.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      portraitBox.style.width = `${w}px`;
      portraitBox.style.height = `${h}px`;
    };

    const render = () => {
      let rect;
      let zoom;
      let wipe = 0;
      let landed = false;
      zoom = heroZoom;
      if (phase === "montage") {
        rect = lerpRect(montageRect, from, springSmooth(intro));
      } else {
        // Page coordinates: the frame scrolls with the page and its move and
        // resize trail behind. The project wipes in from below first.
        rect = lerpRect(from, to, easeInOutCubic(shown));
        wipe = easeInOutCubic(clamp(shown / WIPE_END, 0, 1));
        landed = p > 0.999 && shown > 0.998;
      }
      flyer.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`;
      flyer.style.width = `${rect.w}px`;
      flyer.style.height = `${rect.h}px`;
      placePortrait(rect, zoom);
      cover.style.clipPath = `inset(${(1 - wipe) * 100}% 0 0 0)`;
      // Clickable while en route; the real panel takes over once landed.
      if (flyerLink) {
        const active = phase === "flight" && !landed && shown >= CLICKABLE_FROM;
        const changed = (flyerLink.dataset.active === "true") !== active;
        if (changed) flyerLink.dataset.active = String(active);
        // The frame keeps gliding after scrolling stops, under a still pointer:
        // let the cursor re-check what it is over (coalesced to once a frame).
        if (changed || active) window.dispatchEvent(new Event("cursor:refresh"));
      }
      // Hand over to the real project media once landed. (Opacity, not
      // visibility: the stepper's active image would override visibility.)
      flyer.style.visibility = landed ? "hidden" : "";
      if (target) {
        target.style.opacity = landed ? "" : "0";
        target.style.pointerEvents = landed ? "" : "none";
      }
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      p = progress();
      if (reduce.matches) {
        shown = p;
        velocity = 0;
      } else {
        velocity += (FOLLOW * FOLLOW * (p - shown) - 2 * FOLLOW * velocity) * dt;
        shown += velocity * dt;
      }
      // Settle once the remainder is invisible (< 1px), then snap exact.
      // (A critically damped follow has negligible velocity this close.)
      const settled = Math.abs(p - shown) < 0.002;
      if (settled) {
        shown = p;
        velocity = 0;
      }
      render();
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame || phase !== "flight") return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const remeasure = () => {
      measure();
      if (phase === "flight") shown = p = progress();
      velocity = 0;
      render();
    };

    // --- Opening montage (hard loads of the home page, once per session) ---
    let skipped = false;
    let skipWait = null;
    const wait = (ms) =>
      new Promise((resolve) => {
        if (skipped || cancelled) return resolve();
        const t = setTimeout(resolve, ms);
        skipWait = () => {
          clearTimeout(t);
          resolve();
        };
      });
    const animate = (ms, fn) =>
      new Promise((resolve) => {
        const t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / ms);
          fn(t);
          if (t < 1 && !cancelled) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    // Scrolling never skips the montage (2026-10-23, Jonathan: no scrolling
    // until it finishes): the page stays locked through the cuts and the hold,
    // and opens the moment the window starts growing into the portrait. It can
    // still be skipped on purpose: Escape or Enter, or a mouse click (not a
    // touch, which starts a scroll).
    const onSkip = (e) => {
      if (e.type === "keydown" && e.key !== "Escape" && e.key !== "Enter") return;
      if (e.type === "pointerdown" && e.pointerType !== "mouse") return;
      skipped = true;
      skipWait?.();
    };
    const skipEvents = ["keydown", "pointerdown"];
    // The CSS lock (overflow: hidden) only stops native scrolling; the smooth
    // scroller moves the page itself, and on a fresh load it may not exist yet
    // to be stopped. So scroll input is blocked at the window (capture phase,
    // before any scroller), as during a page transition.
    const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);
    const blockScroll = (e) => {
      if (e.type === "keydown" && !SCROLL_KEYS.has(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const blockEvents = ["wheel", "touchmove", "keydown"];
    const lockScroll = () => blockEvents.forEach((t) => window.addEventListener(t, blockScroll, { capture: true, passive: false }));
    const unlockScroll = () => {
      blockEvents.forEach((t) => window.removeEventListener(t, blockScroll, { capture: true }));
      html.dataset.introScroll = "";
      const lenis = getLenis();
      lenis?.scrollTo(0, { immediate: true, force: true });
      lenis?.start();
    };
    const finishIntro = () => {
      phase = "flight";
      skipEvents.forEach((t) => window.removeEventListener(t, onSkip));
      blockEvents.forEach((t) => window.removeEventListener(t, blockScroll, { capture: true }));
      html.dataset.intro = "done";
      delete html.dataset.introScroll;
      getLenis()?.start();
    };

    const untilGrown = () => {
      const reveal = flyer.firstElementChild;
      const grow = reveal?.getAnimations?.().find((a) => a.animationName?.includes("growIn"));
      if (!grow) return Promise.resolve();
      const { delay, duration } = grow.effect.getTiming();
      const settledAt = delay + duration * GROW_SETTLED;
      return wait(Math.max(0, settledAt - (grow.currentTime ?? 0)));
    };

    const playIntro = async () => {
      getLenis()?.stop();
      lockScroll();
      skipEvents.forEach((t) => window.addEventListener(t, onSkip, { passive: true }));
      const frames = [...montage.querySelectorAll("img")];
      // Start as soon as the first cut is ready; frames still loading are skipped.
      // The growing first image is the opening beat: cuts start as the grow
      // visually settles (on the grow animation's own clock, so the rhythm is
      // the same on every load).
      // Grow the window in once the first image is ready (800 ms at most), on
      // the next frame so it starts from nothing on screen.
      await Promise.race([frames[0].decode().catch(() => {}), wait(800)]);
      await new Promise((r) => requestAnimationFrame(() => r()));
      flyer.firstElementChild.setAttribute("data-grow", "");
      await untilGrown();
      // The first image has been showing while the window grew in, so the
      // first cut goes straight to the next one.
      let next = 1;
      for (let i = 0; i < CUTS.length && !skipped && !cancelled; i++) {
        // Next loaded frame, cycling through the media (frames still loading are skipped).
        let frame = null;
        for (let k = 0; k < frames.length; k++) {
          const idx = (next + k) % frames.length;
          if (frames[idx].complete && frames[idx].naturalWidth) {
            frame = frames[idx];
            next = idx + 1;
            break;
          }
        }
        if (!frame) break;
        frames.forEach((f) => f !== frame && f.removeAttribute("data-on"));
        frame.removeAttribute("data-on");
        void frame.offsetWidth; // restart the push-in when a frame repeats
        frame.style.setProperty("--cut", `${CUTS[i]}ms`);
        frame.setAttribute("data-on", "");
        await wait(CUTS[i]);
      }
      frames.forEach((f) => f.removeAttribute("data-on"));
      montage.style.display = "none";
      intro = 0;
      render();
      await wait(HOLD_MS);
      unlockScroll();
      await animate(skipped ? SKIP_RESIZE_MS : RESIZE_MS, (t) => {
        intro = t;
        render();
      });
      if (cancelled) return;
      finishIntro();
      // The portrait has just settled at the hero (progress 0); if the visitor
      // scrolled while it grew, it glides on to the scroll position with the
      // usual lagged follow instead of jumping there.
      shown = 0;
      p = progress();
      render();
      wake();
    };

    flyer.style.left = "0px";
    flyer.style.top = "0px";
    measure();
    if (phase === "montage") {
      render();
      playIntro();
    } else {
      remeasure();
    }

    const observer = new ResizeObserver(remeasure);
    observer.observe(stage);
    window.addEventListener("resize", remeasure);
    window.addEventListener("work:layout", remeasure);
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      cancelled = true;
      if (phase === "montage") finishIntro();
      observer.disconnect();
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("work:layout", remeasure);
      window.removeEventListener("scroll", wake);
      cancelAnimationFrame(frame);
      if (target) target.style.opacity = target.style.pointerEvents = "";
    };
  }, [refs, portrait]);
}

export default function HeroStage({ profile, projects }) {
  const refs = useRef({
    stage: { current: null },
    heroSlot: { current: null },
    flyer: { current: null },
    portraitBox: { current: null },
    montage: { current: null },
    cover: { current: null },
    flyerLink: { current: null },
  }).current;
  const { portrait } = profile;
  const [topIndex, bottomIndex] = useTitleCycle();
  const media = interleave(projects);
  const first = projects[0].media[0];
  const firstHref = projects[0].href;

  useHeroMotion({ refs, portrait });

  return (
    <div ref={refs.stage} className={styles.stage}>
      <section className={styles.hero} data-snap="start" aria-labelledby="hero-title">
        <h1 id="hero-title" className={styles.heroTitle} aria-label={`${profile.name}, ${profile.heroTitle}`}>
          <span className={classNames(styles.word, styles.wordTop)} aria-hidden="true">
            <span>
              <SplitFlapWord word={profile.heroWords[0][topIndex]} />
            </span>
          </span>
          <span className={classNames(styles.word, styles.wordBottom)} aria-hidden="true">
            <span>
              <SplitFlapWord word={profile.heroWords[1][bottomIndex]} riseDelay={0.1} />
            </span>
          </span>
        </h1>
        <div ref={refs.heroSlot} className={styles.heroSlot} aria-hidden="true" />
        <div className={styles.sides}>
          {/* Both sides rise in line by line once the opening montage ends
              (they're on screen at load, so this plays on load). */}
          <div className={classNames(styles.side, styles.sideLeft, styles.byline)}>
            <RiseText as="p" text={profile.fullName} mode="load" trim delay={0.4} className={classNames(styles.bylineLine, styles.name)} />
            <RiseText as="p" text={profile.location} mode="load" trim delay={0.45} className={classNames(styles.bylineLine, styles.meta)} />
            <RiseText as="p" text={profile.edition} mode="load" trim delay={0.5} className={classNames(styles.bylineLine, styles.meta)} />
          </div>
          {/* The statement, one beat per line, built like the byline (each
              line trimmed, one gap between them) so the two sides mirror
              each other's rhythm and height across the portrait. */}
          {/* Below 1024px the column is too narrow for the set lines, so the
              sentence wraps as one balanced paragraph instead (only one of
              the two is ever displayed). */}
          <div className={classNames(styles.side, styles.sideRight, styles.statement)}>
            {profile.statement.split("\n").map((line, i) => (
              <RiseText key={line} as="p" text={line} mode="load" trim delay={0.45 + i * 0.05} className={classNames(styles.bylineLine, styles.statementLine)} />
            ))}
            <RiseText as="p" text={profile.statement.replace(/\n/g, " ")} mode="load" trim delay={0.45} className={classNames(styles.bylineLine, styles.statementFlow)} />
          </div>
        </div>
      </section>

      <div ref={refs.flyer} className={styles.flyer} data-parallax="">
        <div className={styles.flyerReveal}>
          <div ref={refs.portraitBox} className={styles.portraitBox}>
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              // Not `priority`/eager: React 19.0 sends eager images as HTTP Link
              // preloads with a mis-encoded srcset, so browsers also fetch the
              // 3840w fallback. In view, lazy + high priority still loads at once.
              loading="lazy"
              fetchPriority="high"
              // Largest on-screen size: the 1.5x subject crop of the hero card.
              sizes="(min-width: 1024px) 45vw, 100vw"
              className={styles.fill}
            />
          </div>
          <div ref={refs.montage} className={styles.montage} aria-hidden="true">
            {/* The first cut is the page's LCP, so it preloads (safe since
                React 19.2; see the portrait's note). */}
            {media.map((item, i) => (
              <Image key={item.src} src={item.src} alt="" fill priority={i === 0} sizes="(min-width: 1024px) 15vw, 40vw" className={styles.montageFrame} />
            ))}
          </div>
          <div ref={refs.cover} className={styles.cover} aria-hidden="true">
            {/* Same parallax as the project panel, so the hand-off has no jump. */}
            <div className={styles.coverParallax} data-parallax-image="">
              <Image src={first.src} alt="" fill sizes="(min-width: 1024px) 55vw, 150vw" quality={90} className={styles.coverImage} />
            </div>
          </div>
        </div>
        {/* Mouse shortcut to the first project while its image is en route
            (keyboard users reach it through the project's CTA). */}
        {firstHref && (
          <Link
            ref={refs.flyerLink}
            href={firstHref}
            className={styles.flyerLink}
            data-active="false"
            data-cursor-label={mediaCursorLabel}
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
