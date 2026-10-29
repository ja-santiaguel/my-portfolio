"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import classNames from "classnames";
import styles from "./WorkSection.module.css";
import ProjectSlide, { projectName } from "./ProjectSlide";
import ProjectCard from "./ProjectCard";
import { runLayoutTransition } from "./layoutTransition";
import { squareFocus } from "./coverPhoto";
import { useMediaParallax } from "./useMediaParallax";
import { scrollToTarget } from "@/lib/scroll";
import HoverArrow from "../HoverArrow";

const VIEWS = [
  { id: "list", label: "List" },
  { id: "grid", label: "Grid" },
];
const STORAGE_KEY = "work-view";

export default function WorkSection({ projects }) {
  const sectionRef = useRef(null);
  const [view, setView] = useState("list");
  const [focused, setFocused] = useState(projects[0].slug);
  const [inView, setInView] = useState(false);
  // Where the visitor was in the list when they switched to the grid: the
  // slide in focus and its offset from the top of the window (2026-10-19).
  const listSpot = useRef(null);
  // The layout being switched to: the toggle shows it at once, before the
  // rearrange has run.
  const [pending, setPending] = useState(null);

  // Restore the visitor's last layout (a per-visitor convenience only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "list" || saved === "grid") setView(saved);
    } catch {}
  }, []);

  // The hero portrait lands on the first project's media: tell it to re-measure
  // whenever the layout changes.
  useEffect(() => {
    window.dispatchEvent(new Event("work:layout"));
  }, [view]);

  // The project crossing the middle of the viewport is the one in focus.
  useEffect(() => {
    if (view !== "list") return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setFocused(e.target.dataset.slide)),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sectionRef.current.querySelectorAll("[data-slide]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const switchView = (next, anchor) => {
    if (next === view && !anchor) return;
    const root = sectionRef.current;
    const target = anchor ?? null;

    // Leaving the list: remember the project the page would have settled on
    // (2026-10-20), the one taking up most of the window, as the settle snap
    // judges it, even when the visitor clicked mid-way between two. Coming
    // back from the grid lands on it fully snapped (its top at the top).
    if (view === "list" && next === "grid") {
      const vh = window.innerHeight;
      let best = null, area = 0;
      root.querySelectorAll("[data-slide]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        if (visible > area) { area = visible; best = el.dataset.slide; }
      });
      const slug = best ?? focused;
      listSpot.current = { slug, offset: 0 };
    }
    const back = !anchor && next === "list" ? listSpot.current : null;

    const started = runLayoutTransition(root, () => {
      flushSync(() => {
        setPending(null);
        setView(next);
        setFocused(target ?? back?.slug ?? projects[0].slug);
      });
      // Switching to the grid lands at its top. Back to the list returns to
      // where the visitor was in it (the same slide, at the same height);
      // opening a specific project from the grid (anchor) lands on that
      // project instead.
      if (back) {
        const el = document.getElementById(`project-${back.slug}`);
        if (el) scrollToTarget(el.getBoundingClientRect().top + window.scrollY - back.offset, { immediate: true });
        else scrollToTarget(root, { immediate: true });
      } else if (anchor) {
        scrollToTarget(document.getElementById(`project-${anchor}`), { immediate: true });
        // An opened card is replaced by its slide: move focus to the slide's heading.
        document.getElementById(`project-${anchor}-title`)?.focus({ preventScroll: true });
      } else {
        scrollToTarget(root, { immediate: true });
      }
    });

    if (!started) return;
    if (next !== view) setPending(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  // Load the index thumbnails once the page is idle: they're lazy and
  // clipped out of view, so the browser would otherwise fetch them only on the
  // first reveal, and the wipe would play over empty frames (2026-10-17).
  // Switching them to eager on the client fetches them without preload headers.
  useEffect(() => {
    const load = () =>
      sectionRef.current?.querySelectorAll("nav[aria-label='Projects'] img").forEach((img) => {
        img.loading = "eager";
      });
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(load, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(load, 1200);
    return () => clearTimeout(t);
  }, []);

  useMediaParallax([view]);

  return (
    <section id="work" ref={sectionRef} className={styles.work} aria-labelledby="work-title">
      <div className={classNames(styles.bar, { [styles.barVisible]: inView })}>
        <div>
          <h2 id="work-title" className="visually-hidden">
            Selected work
          </h2>
          <div className={styles.toggle} role="group" aria-label="Layout">
            {VIEWS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={styles.toggleButton}
                aria-pressed={(pending ?? view) === id}
                onClick={() => switchView(id)}
              >
                <span aria-hidden="true" className={styles.bracket}>
                  <span className="bracket bracket-open">[</span>{" "}
                </span>
                <HoverArrow>{label}</HoverArrow>
                <span aria-hidden="true" className={styles.bracket}>
                  {" "}
                  <span className="bracket bracket-close">]</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div className={styles.list}>
          {projects.map((p, i) => (
            <ProjectSlide
              key={p.slug}
              project={p}
              flightTarget={i === 0}
            />
          ))}
        </div>
      ) : (
        <ul className={styles.grid} data-snap="start">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard project={p} index={i} featured={i === 0} flightTarget={i === 0} onOpen={(slug) => switchView("list", slug)} />
            </li>
          ))}
        </ul>
      )}

      <nav
        className={classNames(styles.index, { [styles.indexVisible]: view === "list" && inView })}
        aria-label="Projects"
        inert={!(view === "list" && inView)}
        style={{ "--active": Math.max(0, projects.findIndex((p) => p.slug === focused)), "--count": projects.length }}
      >
        {/* One outline that glides to the active project. */}
        <span className={styles.indexOutline} aria-hidden="true" />
        <ul>
          {projects.map((p, i) => {
            const thumb = p.media[0];
            const current = focused === p.slug;
            return (
              <li key={p.slug} style={{ "--i": i }}>
                <button
                  type="button"
                  className={classNames(styles.indexItem, { [styles.indexCurrent]: current })}
                  onClick={() => scrollToTarget(document.getElementById(`project-${p.slug}`))}
                  aria-current={current ? "true" : undefined}
                  aria-label={projectName(p)}
                  tabIndex={view === "list" && inView ? 0 : -1}
                >
                  <Image src={thumb.src} alt="" width={100} height={100} sizes="64px" className={styles.indexThumb} style={squareFocus(thumb) ? { objectPosition: squareFocus(thumb) } : undefined} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
