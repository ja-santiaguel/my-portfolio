"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CaseStudy.module.css";
import Bracketed from "../Bracketed";
import { SCREEN_PARALLAX } from "./parallax";

// A short, muted, looping screen recording: proof of the real product in
// motion. Plays only while on screen; always pausable (WCAG 2.2.2); under
// reduced motion it starts paused on its poster frame.
//
// The "[ Pause ]" / "[ Play ]" tab follows the pointer while it's over the
// video (a quick damped follow), so the whole video works as the control;
// when the pointer leaves, the tab glides back to its resting corner. On
// touch and keyboard it simply stays in the corner.
const FOLLOW = 16; // per second
const INSET = 16; // resting position from the bottom-right corner, px

export default function LoopVideo({ video, className = "", parallax = false }) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const tabRef = useRef(null);
  const [wanted, setWanted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const visible = useRef(false);
  const target = useRef(null); // pointer position in the frame, or null = corner
  const pos = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setWanted(false);
  }, []);

  useEffect(() => {
    const v = ref.current;
    const sync = () => {
      if (wanted && visible.current) v.play().catch(() => {});
      else v.pause();
    };
    const observer = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      sync();
    });
    observer.observe(v);
    sync();
    return () => observer.disconnect();
  }, [wanted]);

  // The tab's centre, in frame coordinates, when it rests in the corner.
  const corner = () => {
    const f = frameRef.current.getBoundingClientRect();
    const t = tabRef.current.getBoundingClientRect();
    return { x: f.width - INSET - t.width / 2, y: f.height - INSET - t.height / 2 };
  };

  const place = ({ x, y }) => {
    const t = tabRef.current;
    t.style.transform = `translate3d(${(x - t.offsetWidth / 2).toFixed(1)}px, ${(y - t.offsetHeight / 2).toFixed(1)}px, 0)`;
  };

  const last = useRef(0);
  const tick = (now) => {
    const dt = last.current ? Math.min((now - last.current) / 1000, 1 / 30) : 1 / 60;
    last.current = now;
    const goal = target.current ?? corner();
    const p = pos.current ?? goal;
    const k = 1 - Math.exp(-FOLLOW * dt);
    const next = { x: p.x + (goal.x - p.x) * k, y: p.y + (goal.y - p.y) * k };
    pos.current = next;
    place(next);
    if (Math.abs(goal.x - next.x) + Math.abs(goal.y - next.y) > 0.3) raf.current = requestAnimationFrame(tick);
    else {
      pos.current = goal;
      place(goal);
      raf.current = 0;
      last.current = 0;
    }
  };

  const wake = () => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  // Rest in the corner on mount and whenever the frame or the tab resizes.
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (target.current === null) {
        pos.current = corner();
        place(pos.current);
      }
    });
    ro.observe(frameRef.current);
    ro.observe(tabRef.current); // the label changes width (Play / Pause)
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onPointerMove = (e) => {
    if (!fine()) return;
    const f = frameRef.current.getBoundingClientRect();
    target.current = { x: e.clientX - f.left, y: e.clientY - f.top };
    wake();
  };

  const onPointerLeave = () => {
    target.current = null;
    wake();
  };

  const media = (
    <video
      ref={ref}
      className={parallax ? styles.videoFill : styles.videoMedia}
      width={video.width}
      height={video.height}
      poster={video.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={video.label}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    >
      <source src={video.src} type="video/webm" />
    </video>
  );

  return (
    <div
      ref={frameRef}
      className={`${styles.video} ${className}`}
      style={parallax ? { aspectRatio: `${video.width} / ${video.height}` } : undefined}
      {...(parallax ? SCREEN_PARALLAX : {})}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      // Mouse: a click anywhere on the video toggles it (the tab shows where).
      onClick={(e) => {
        if (e.target === frameRef.current || e.target.tagName === "VIDEO") setWanted((w) => !w);
      }}
      data-cursor="pointer"
    >
      {parallax ? (
        <div className={styles.parallaxInner} data-parallax-image="">
          {media}
        </div>
      ) : (
        media
      )}
      <button
        ref={tabRef}
        type="button"
        className={styles.videoToggle}
        onClick={() => setWanted((w) => !w)}
        aria-label={playing ? "Pause video" : "Play video"}
      >
        <Bracketed>{playing ? "[ Pause ]" : "[ Play ]"}</Bracketed>
      </button>
    </div>
  );
}
