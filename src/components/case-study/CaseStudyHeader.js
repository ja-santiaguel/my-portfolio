import Link from "next/link";
import slide from "../home/Slide.module.css";
import Bracketed from "../Bracketed";
import styles from "./CaseStudy.module.css";
import HoverArrow from "../HoverArrow";
import ActionLabel from "../ActionLabel";
import Reveal from "./Reveal";
import { RiseLetters } from "../home/Rise";
import RiseText, { RiseLine } from "../RiseText";

// The first screen, built for a 55-second look: what it is, the outcome, my
// role, when, with what, and a way to see it live; the product follows in
// the 3D showcase below. It's on screen at load, so it rises in on load rather than with
// scroll: the title's letters, then the text below line by line.
export default function CaseStudyHeader({ study }) {
  const { name, lead, outcome, spec, live } = study;
  return (
    <Reveal as="header" className={styles.header}>
      {/* The way back to the work (2026-10-18), in the navigation column, on
          its own row above the title. */}
      <Link href="/#work" className={`${styles.back} touch-target`}>
        <HoverArrow back>
          <RiseLine mode="load" delay={0.2}>
            <Bracketed>[ Back to work ]</Bracketed>
          </RiseLine>
        </HoverArrow>
      </Link>
      <h1 className={styles.title} aria-label={name}>
        {name
          .toUpperCase()
          .split(" ")
          .map((word, i) => (
            <RiseLetters key={word} text={word} base={i * 0.15} />
          ))}
      </h1>
      <p className={styles.lead}>
        <RiseText text={lead} mode="load" delay={0.6} />
      </p>

      <div className={styles.facts}>
        <dl className={styles.factList}>
          {spec.map((row, i) => (
            <div key={row.label}>
              <dt className={styles.label}>
                <RiseLine mode="load" delay={0.68 + i * 0.05}>
                  {row.label}
                </RiseLine>
              </dt>
              {row.items.map((item, k) => (
                <dd key={item} className={styles.factValue}>
                  <RiseText
                    text={item}
                    mode="load"
                    delay={0.7 + i * 0.05 + k * 0.03}
                  />
                </dd>
              ))}
            </div>
          ))}
        </dl>
        {/* Status and the live link only when the project has them (the
            older, self-initiated projects have neither). */}
        {(outcome || live) && (
          <div className={styles.factsAside}>
            {outcome && (
              // The same markup as the other columns (dt + dd), so its label
              // and value sit on exactly the same lines as theirs.
              <dl className={styles.factsAsideList}>
                <div>
                  <dt className={styles.label}>
                    <RiseLine mode="load" delay={0.88}>
                      Status
                    </RiseLine>
                  </dt>
                  <dd className={styles.factValue}>
                    <RiseText text={outcome} mode="load" delay={0.9} />
                  </dd>
                </div>
              </dl>
            )}
            {live && (
              <a
                href={live.href}
                className={`${slide.learnMoreButton} ${styles.liveLink} ${styles.liveLine} touch-target`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live site: ${name} (opens in a new tab)`}
              >
                <HoverArrow>
                  <RiseLine mode="load" delay={0.95}>
                    <ActionLabel>{live.label}</ActionLabel>
                  </RiseLine>
                </HoverArrow>
              </a>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}
