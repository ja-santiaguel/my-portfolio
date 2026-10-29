import { Fragment } from "react";
import Link from "next/link";
import styles from "./ServicesSection.module.css";
import { RiseLettersScroll, RiseLine } from "../RiseText";
import HoverArrow from "../HoverArrow";
import Bracketed from "../Bracketed";
import slide from "./Slide.module.css";
import { CiMonitor, CiViewBoard } from "react-icons/ci";
import { CATEGORIES } from "../CategoryIcon";

// The disciplines' icons, from Circum like the rest: the wireframe board for
// UX/UI, the monitor for development, and the work's own Creative icon.
const ICONS = { board: CiViewBoard, monitor: CiMonitor, creative: CATEGORIES.creative.Icon };

// Services (2026-10-26), between the work and the footer: proof first, then
// what Jonathan can do for you, then "Interested in creating a digital
// experience?". The services are disciplines (UX/UI design, web development,
// creative); each row says what it covers and links to the projects that
// show it, so every claim has evidence one tap away. Rows sit on fine title-block rules, like the slides'
// spec tables. The availability line beside the title is kept current in
// content/projects.js, with "[ Let’s talk ]" (the footer's action) under it.
export default function ServicesSection({ services, projects, availability, email }) {
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const projectName = (p) => [p.title, p.secondTitle].filter(Boolean).join(" ").replace(/ /g, " ");

  return (
    <section id="services" className={styles.services} data-snap="free" data-land="center" aria-labelledby="services-title">
      <div className={styles.head}>
        <h2 id="services-title" className={styles.title} aria-label="Services">
          <RiseLettersScroll text="Services" />
        </h2>
        <div className={styles.status}>
          {availability && (
            <p className={styles.availability} data-status={availability.status}>
              <span className={styles.dot} aria-hidden="true" />
              <RiseLine>{availability.label}</RiseLine>
            </p>
          )}
          {email && (
            <a className={`${slide.learnMoreButton} touch-target`} href={`mailto:${email}`}>
              <HoverArrow>
                <RiseLine>
                  <Bracketed>[ Let’s talk ]</Bracketed>
                </RiseLine>
              </HoverArrow>
            </a>
          )}
        </div>
      </div>

      <ul className={styles.list}>
        {services.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <li key={s.name} className={styles.row} data-trigger="">
              <h3 className={styles.name} aria-label={s.name}>
                {Icon && <Icon className={styles.icon} aria-hidden="true" focusable="false" />}
                {/* Word by word, like the case-study titles, so a long name
                    ("Web development") wraps within its columns. */}
                {s.name.split(" ").map((word, i, words) => (
                  <Fragment key={word}>
                    {i > 0 && " "}
                    <RiseLettersScroll text={word} start={words.slice(0, i).join("").length} />
                  </Fragment>
                ))}
              </h3>
              <ul className={styles.items}>
                {s.items.map((item, i) => (
                  <li key={item}>
                    <RiseLine trim={i === 0 && "start"}>{item}</RiseLine>
                  </li>
                ))}
              </ul>
              <ul className={styles.proof} aria-label={`${s.name}: projects`}>
                {s.projects
                  .map((slug) => bySlug[slug])
                  .filter(Boolean)
                  .map((p, i) => (
                    <li key={p.slug}>
                      <Link href={p.href} className={styles.proofLink}>
                        <HoverArrow>
                          <RiseLine trim={i === 0 && "start"}>{projectName(p)}</RiseLine>
                        </HoverArrow>
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
